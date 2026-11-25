import { SplatStar } from '@/components/zine'

/**
 * RF-110 v5 — las cintas en bucle que cierran el hero.
 *
 * Misma animación de siempre (dos copias y un desplazamiento del 50%, ver
 * `.p-marquee` en globals.css), otro material: una cinta de embalaje kraft
 * impresa en tinta y una tira de papel magenta, con extremos dentados y una
 * salpicadura mini entre frases en lugar de la estrella de neón.
 *
 * `aria-hidden` porque repite texto que ya está en la página.
 */
export function Marquee({
  items,
  variant = 'kraft',
}: {
  items: readonly string[]
  variant?: 'kraft' | 'magenta'
}) {
  const sequence = [...items, ...items, ...items]
  const isKraft = variant === 'kraft'

  return (
    <div
      aria-hidden="true"
      className={`p-marquee ${isKraft ? 'm-kraft' : 'm-magenta p-marquee--reverse'} select-none overflow-hidden whitespace-nowrap py-3 text-tinta`}
    >
      <div className="p-marquee__track">
        {[0, 1].map((copy) => (
          <div key={copy} className="flex shrink-0 items-center">
            {sequence.map((item, index) => (
              <span key={`${copy}-${index}`} className="p-display flex items-center px-5 text-lg sm:text-2xl">
                {item}
                <SplatStar className="ml-10 h-4 w-4" />
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

/**
 * Las dos cintas cruzadas que separan el hero del resto, inclinadas en
 * sentidos opuestos. El contenedor recorta lo que se sale al girar, así que
 * no genera scroll horizontal.
 */
export function CrossedMarquees({ items }: { items: readonly string[] }) {
  return (
    <div aria-hidden="true" className="relative overflow-x-clip py-10 sm:py-14">
      <div className="-mx-8 -rotate-2">
        <Marquee items={items} variant="kraft" />
      </div>
      <div className="-mx-8 -mt-3 rotate-[1.5deg]">
        <Marquee items={items} variant="magenta" />
      </div>
    </div>
  )
}
