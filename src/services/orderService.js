const { getCartByUserId, clearCart } = require("../repositories/cartRepository");
const NotFoundError = require("../utils/notFoundError");
const BadRequestError = require('../utils/badRequestError');
const { findUser } = require("../repositories/userRepository");
const { createNewOrder, getOrdersByUserId, getOrderById, updateOrderStatus } = require("../repositories/orderRepository");
const InternalServerError = require("../utils/internalServerError");

async function createOrder(userId, paymentMethod) {
    // Fetch cart
    const cart = await getCartByUserId(userId);
    if (!cart) {
        throw new NotFoundError("Cart not found");
    }

    // Ensure cart has items
    if (!cart.items || cart.items.length === 0) {
        throw new BadRequestError(["Cart is empty, please add some items to the cart"]);
    }

    // Fetch user details
    const user = await findUser({ _id: cart.user });
    if (!user) {
        throw new NotFoundError("User not found");
    }

    // Create order object
    const orderObject = {
        user: cart.user,
        items: [],
        status: "ORDERED",
        totalPrice: 0,
        address: user.address || "No address provided",
        paymentMethod
    };

    // Populate order items
    for (const cartItem of cart.items) {
        if (!cartItem.product || !cartItem.product._id || typeof cartItem.quantity !== "number") {
            throw new BadRequestError(["Invalid product in cart"]);
        }
        orderObject.items.push({ product: cartItem.product._id, quantity: cartItem.quantity });
        orderObject.totalPrice += cartItem.quantity * (cartItem.product.price || 0);
    }

    // Save the order
    const order = await createNewOrder(orderObject);
    if (!order) {
        throw new InternalServerError("Failed to create order");
    }

    // Clear user's cart after order is placed
    await clearCart(userId);

    return order;
}

async function getAllOrdersCreatedByUser(userId) {
    const orders = await getOrdersByUserId(userId);
    if (!orders || orders.length === 0) {
        throw new NotFoundError("No orders found");
    }
    return orders;
}

async function getOrderDetailsById(orderId) {
    const order = await getOrderById(orderId);
    if (!order) {
        throw new NotFoundError("Order not found");
    }
    return order;
}

async function updateOrder(orderId, status) {
    const order = await updateOrderStatus(orderId, status);
    if (!order) {
        throw new NotFoundError("Order not found");
    }
    return order;
}

module.exports = {
    createOrder,
    getAllOrdersCreatedByUser,
    getOrderDetailsById,
    updateOrder
};
