import tkinter as tk
from tkinter import messagebox, simpledialog
import sqlite3

# Database setup
def setup_database():
    conn = sqlite3.connect('pos_system.db')
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS products (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT UNIQUE NOT NULL,
            quantity INTEGER NOT NULL
        )
    ''')
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS sales (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            product_name TEXT NOT NULL,
            quantity INTEGER NOT NULL
        )
    ''')
    conn.commit()
    conn.close()

setup_database()


class Inventory:
    def print_products(self):
        conn = sqlite3.connect('pos_system.db')
        cursor = conn.cursor()
        cursor.execute('SELECT * FROM products')
        products = cursor.fetchall()
        conn.close()
        print("Current products in the database:")
        for product in products:
            print(product)
        self.get_products()  # Call to check if products are being retrieved correctly


    def __init__(self):
        self.products = {}

    def add_product(self, name, quantity):
        conn = sqlite3.connect('pos_system.db')
        cursor = conn.cursor()
        cursor.execute('INSERT OR IGNORE INTO products (name, quantity) VALUES (?, ?)', (name, quantity))
        cursor.execute('UPDATE products SET quantity = quantity + ? WHERE name = ?', (quantity, name))
        conn.commit()
        conn.close()


    def update_product(self, name, quantity):
        conn = sqlite3.connect('pos_system.db')
        cursor = conn.cursor()
        cursor.execute('UPDATE products SET quantity = ? WHERE name = ?', (quantity, name))
        if cursor.rowcount == 0:
            messagebox.showerror("Error", "Product not found!")
        conn.commit()
        conn.close()


    def delete_product(self, name):
        conn = sqlite3.connect('pos_system.db')
        cursor = conn.cursor()
        cursor.execute('DELETE FROM products WHERE name = ?', (name,))
        if cursor.rowcount == 0:
            messagebox.showerror("Error", "Product not found!")
        else:
            messagebox.showinfo("Success", "Product deleted successfully!")
        conn.commit()
        conn.close()


    def get_products(self):
        conn = sqlite3.connect('pos_system.db')
        cursor = conn.cursor()
        cursor.execute('SELECT id, name, quantity FROM products')
        products = cursor.fetchall()
        conn.close()
        return {id: (name, quantity) for id, name, quantity in products}


class Sales:
    def __init__(self, inventory):
        self.inventory = inventory

    def process_sale(self, name, quantity):
        products = self.inventory.get_products()
        if name in products.values() and products[next(key for key, value in products.items() if value[0] == name)][1] >= quantity:


            conn = sqlite3.connect('pos_system.db')
            cursor = conn.cursor()
            cursor.execute('UPDATE products SET quantity = quantity - ? WHERE name = ?', (quantity, name))
            cursor.execute('INSERT INTO sales (product_name, quantity) VALUES (?, ?)', (name, quantity))
            conn.commit()
            conn.close()
            messagebox.showinfo("Success", "Sale processed successfully!")
        else:
            messagebox.showerror("Error", "Insufficient inventory!")


class POSApplication:
    def __init__(self, root):
        self.root = root
        self.root.title("Point of Sale System")
        self.inventory = Inventory()
        self.sales = Sales(self.inventory)

        self.create_widgets()
        self.update_inventory_display()

    def create_widgets(self):
        # Inventory Management
        self.inventory_frame = tk.Frame(self.root)
        self.inventory_frame.pack(pady=10)

        self.product_name_entry = tk.Entry(self.inventory_frame)
        self.product_name_entry.grid(row=0, column=1)
        tk.Label(self.inventory_frame, text="Product Name:").grid(row=0, column=0)

        self.product_quantity_entry = tk.Entry(self.inventory_frame)
        self.product_quantity_entry.grid(row=1, column=1)
        tk.Label(self.inventory_frame, text="Quantity:").grid(row=1, column=0)

        tk.Button(self.inventory_frame, text="Add Product", command=self.add_product).grid(row=2, column=0)
        tk.Button(self.inventory_frame, text="Update Product", command=self.update_product).grid(row=2, column=1)
        tk.Button(self.inventory_frame, text="Delete Product", command=self.delete_product).grid(row=2, column=2)

        # Inventory Display
        self.inventory_display_frame = tk.Frame(self.root)
        self.inventory_display_frame.pack(pady=10)

        self.inventory_labels = []

        # Sales Management
        self.sales_frame = tk.Frame(self.root)
        self.sales_frame.pack(pady=10)

        self.sale_product_name_entry = tk.Entry(self.sales_frame)
        self.sale_product_name_entry.grid(row=0, column=1)
        tk.Label(self.sales_frame, text="Product Name:").grid(row=0, column=0)

        self.sale_quantity_entry = tk.Entry(self.sales_frame)
        self.sale_quantity_entry.grid(row=1, column=1)
        tk.Label(self.sales_frame, text="Quantity:").grid(row=1, column=0)

        tk.Button(self.sales_frame, text="Process Sale", command=self.process_sale).grid(row=2, column=0)

    def add_product(self):
        name = self.product_name_entry.get()
        try:
            quantity = int(self.product_quantity_entry.get())
        except ValueError:
            messagebox.showerror("Error", "Please enter a valid quantity.")
            return
        self.inventory.add_product(name, quantity)
        self.product_name_entry.delete(0, tk.END)
        self.product_quantity_entry.delete(0, tk.END)
        self.update_inventory_display()

    def update_product(self):
        name = self.product_name_entry.get()
        try:
            quantity = int(self.product_quantity_entry.get())
        except ValueError:
            messagebox.showerror("Error", "Please enter a valid quantity.")
            return
        self.inventory.update_product(name, quantity)
        self.product_name_entry.delete(0, tk.END)
        self.product_quantity_entry.delete(0, tk.END)
        self.update_inventory_display()

    def delete_product(self):
        name = self.product_name_entry.get()
        self.inventory.delete_product(name)
        self.product_name_entry.delete(0, tk.END)
        self.product_quantity_entry.delete(0, tk.END)
        self.update_inventory_display()

    def update_inventory_display(self):
        # Clear previous inventory display
        for label in self.inventory_labels:
            label.destroy()
        self.inventory_labels.clear()

        # Get current products and display them
        products = self.inventory.get_products()
        for row_index, (id, (name, quantity)) in enumerate(products.items()):
            label = tk.Label(self.inventory_display_frame, text=f"ID: {id}, Name: {name}, Quantity: {quantity}")
            label.pack()
            self.inventory_labels.append(label)

    def open_inventory_window(self):
        inventory_window = tk.Toplevel(self.root)
        inventory_window.title("Inventory")
        
        # Create a grid layout for displaying products if any exist
        products = self.inventory.get_products()
        for row_index, (id, (name, quantity)) in enumerate(products.items()):
            tk.Label(inventory_window, text=f"ID: {id}").grid(row=row_index, column=0)
            tk.Label(inventory_window, text=f"Name: {name}").grid(row=row_index, column=1)
            tk.Label(inventory_window, text=f"Quantity: {quantity}").grid(row=row_index, column=2)

    def process_sale(self):
        name = self.sale_product_name_entry.get()
        try:
            quantity = int(self.sale_quantity_entry.get())
        except ValueError:
            messagebox.showerror("Error", "Please enter a valid quantity.")
            return
        self.sales.process_sale(name, quantity)
        self.sale_product_name_entry.delete(0, tk.END)
        self.sale_quantity_entry.delete(0, tk.END)

if __name__ == "__main__":
    root = tk.Tk()
    app = POSApplication(root)
    app.inventory.print_products()  # Print products on startup
    root.mainloop()
