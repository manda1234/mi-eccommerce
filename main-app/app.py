from flask import Flask, render_template, request
import requests
import os

app = Flask(__name__)

product_service_host = "localhost" if os.getenv("HOSTNAME") is None else "product-service"
cart_service_host = "localhost" if os.getenv("HOSTNAME") is None else "cart-service"
review_service_host = "localhost" if os.getenv("HOSTNAME") is None else "review-service"

def get_products(product_id):
    try:
        response = requests.get(f'http://{product_service_host}:3000/products/{product_id}')
        response.raise_for_status()
        return response.json()
    except Exception as e:
        print(f"Error fetching product data: {e}")
        return {"error": "Failed to fetch product data"}

def get_carts(product_id):
    try:
        response = requests.get(f'http://{cart_service_host}:3002/cart')
        response.raise_for_status()
        data = response.json()
        total_quantity = 0
        if 'data' in data and isinstance(data['data'], list):
            for item in data['data']:
                if item['product_id'] == product_id:
                    total_quantity = item.get('quantity', 0)
                    break
        return total_quantity
    except Exception as e:
        print(f"Error fetching cart data: {e}")
        return 0

def get_reviews(product_id):
    try:
        response = requests.get(f'http://{review_service_host}:3003/products/{product_id}')
        response.raise_for_status()
        data = response.json()
        return data.get('data', {"reviews": [], "product": {}})
    except Exception as e:
        print(f"Error fetching review data: {e}")
        return {"error": "Failed to fetch review data"}

@app.route('/product/<int:product_id>')
def get_product_info(product_id):
    product = get_products(product_id)
    cart_quantity = get_carts(product_id)
    review = get_reviews(product_id)

    combined_response = {
        "product": product if "error" not in product else None,
        "cart": cart_quantity,
        "reviews": review.get("reviews", []) if "error" not in review else []
    }

    # === Tambahkan blok berikut untuk JSON ===
    if request.args.get('format') == "json":
        return {
            "success": True,
            "message": "Product data fetched successfully",
            "data": combined_response
        }
    # === Selesai penambahan ===

    return render_template('product.html', **combined_response)

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=3005, debug=True)