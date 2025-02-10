import tkinter as tk
from tkinter import messagebox, simpledialog

class Inventory:
    def __init__(self):
        self.products = {}

    def add_product(self, name, quantity):
        if name in self.products:
            self.products[name] += quantity
        else:
            self.products[name] = quantity

    def update_product(self, name, quantity):
        if name in self.products:
            self.products[name] = quantity
        else:
            messagebox.showerror("Error", "Product not found!")

    def delete_product(self, name):
        if name in self.products:
            del self.products[name]
        else:
            messagebox.showerror("Error", "Product not found!")

    def get_products(self):
        return self.products

class Sales:
    def __init__(self, inventory):
        self.inventory = inventory

    def process_sale(self, name, quantity):
        if name in self.inventory.products and self.inventory.products[name] >= quantity:
            self.inventory.products[name] -= quantity
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

        self.show_inventory_button = tk.Button(self.root, text="Show Inventory", command=self.open_inventory_window)
        self.show_inventory_button.pack(pady=10)

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

    def delete_product(self):
        name = self.product_name_entry.get()
        self.inventory.delete_product(name)
        self.product_name_entry.delete(0, tk.END)
        self.product_quantity_entry.delete(0, tk.END)

    def open_inventory_window(self):
        inventory_window = tk.Toplevel(self.root)
        inventory_window.title("Inventory")
        inventory_list = "\n".join([f"{name}: {quantity}" for name, quantity in self.inventory.get_products().items()])
        tk.Label(inventory_window, text=inventory_list if inventory_list else "No products in inventory.").pack(pady=10)

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
    root.mainloop()
