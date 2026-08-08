# RF-104 — Formulario de contacto
#
# Cada criterio de aceptación del SRS convertido en escenario ejecutable.
# No se ejecuta con Cucumber (sería una dependencia más para tres campos): cada
# escenario está implementado en `e2e/contact-form.spec.ts` o en
# `e2e/contact-contract.spec.ts`, con el nombre del escenario como título del
# test. La trazabilidad es literal: si borras un escenario de aquí, sobra un
# test allí.
#
# Leyenda de capa:
#   [B] navegador real     [C] contrato/servidor     [U] unitario

Feature: Contact form submission

  Background:
    Given the site is running with the official Cloudflare Turnstile test keys
    And no real Resend credential is configured

  # --- Camino feliz --------------------------------------------------------

  # [B] e2e/contact-form.spec.ts
  Scenario: Successful submission with valid data
    Given a visitor has filled name, email, and message correctly
    And Turnstile has issued a valid token
    When they submit the form
    Then they see an explicit success state
    And exactly one email is handed to the mail transport

  # --- Fail-closed de Turnstile (la regresión de koa-landing) ---------------

  # [B] e2e/contact-form.spec.ts — EL TEST CRÍTICO
  Scenario: Submit blocked before Turnstile token arrives
    Given a visitor has filled the form
    And Turnstile has not yet issued a token
    When they attempt to submit
    Then the submit button is disabled
    And the reason is stated in visible text, not left silent
    And no request reaches the server action

  # [B] e2e/contact-form.spec.ts
  Scenario: Token expiry re-disables the submit button
    Given Turnstile had issued a token and the button became enabled
    When the token expires or the widget errors
    Then the submit button is disabled again

  # [B] e2e/contact-form.spec.ts
  Scenario: Server rejects a request with no Turnstile token, even if the button was somehow enabled client-side
    Given the disabled attribute is stripped from the submit button in the DOM
    And the hidden token field is empty
    When the form is submitted
    Then the server rejects it with a generic error
    And no email is handed to the mail transport

  # [B] e2e/contact-form.spec.ts
  Scenario: Server rejects a token that Cloudflare refuses
    Given the browser supplies a well-formed token
    And Cloudflare's siteverify rejects it
    When the server processes the submission
    Then it is rejected with a generic error
    And the specific reason is never shown to the visitor

  # --- Validación de servidor ----------------------------------------------

  # [B] e2e/contact-form.spec.ts
  Scenario: Oversized message field
    Given a message field with 50,000 characters
    When submitted
    Then the server rejects it before attempting to send
    And the visitor sees which field is wrong

  # [U] e2e/contact-validation.unit.spec.ts
  Scenario Outline: Field-level rejection
    Given a payload where <field> is <case>
    When the server validates it
    Then it returns the code <code>
    And the payload value never appears in the result

    Examples:
      | field   | case                     | code          |
      | name    | empty                    | REQUIRED      |
      | name    | a single character       | TOO_SHORT     |
      | name    | 81 characters            | TOO_LONG      |
      | name    | containing CRLF          | CONTROL_CHARS |
      | email   | empty                    | REQUIRED      |
      | email   | without an @             | INVALID_EMAIL |
      | email   | 255 characters           | TOO_LONG      |
      | email   | containing CRLF          | CONTROL_CHARS |
      | message | empty                    | REQUIRED      |
      | message | 9 characters             | TOO_SHORT     |
      | message | 5001 characters          | TOO_LONG      |
      | message | containing a NUL byte    | CONTROL_CHARS |

  # [U] e2e/contact-validation.unit.spec.ts
  Scenario: Unicode and newlines are accepted where they are legitimate
    Given a name with accents and a message with line breaks
    When the server validates it
    Then it is accepted

  # --- Rate limit ----------------------------------------------------------

  # [B] e2e/contact-form.spec.ts
  Scenario: Repeated submissions from the same IP are throttled
    Given the per-IP limit is 2 submissions
    When a visitor submits a third time
    Then they see an explicit rate-limit message
    And no third email is handed to the mail transport

  # [U] e2e/contact-validation.unit.spec.ts
  Scenario: The window slides instead of locking permanently
    Given a client that hit the limit
    When the window elapses
    Then they are allowed again

  # --- Degradación visible (no fallo silencioso) ----------------------------

  # [B] e2e/contact-form.spec.ts
  Scenario: The mail provider is unavailable
    Given no Resend credential is configured
    And Turnstile has issued a valid token
    When the visitor submits valid data
    Then they see an explicit error state
    And the error text tells them another way to reach Luis
    And the failure is never silent

  # --- No eco del input (T-103) --------------------------------------------

  # [B] e2e/contact-form.spec.ts
  Scenario: Submitted content is never rendered back to the page
    Given a visitor submits a message containing an HTML tag
    When any state is rendered afterwards
    Then that content appears nowhere in the page markup

  # --- Fail-closed por ausencia de configuración ---------------------------

  # [C] e2e/contact-contract.spec.ts
  Scenario: No Turnstile site key at all
    Given the site key is not configured and test mode is off
    When the page renders
    Then the form is disabled with a stated reason
    And no submission is possible
