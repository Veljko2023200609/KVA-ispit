export interface OrderModel {
    orderId: string
    toyId: number
    toyName: string
    time: string
    quantity: number
    price: number
    permalink: string
    status: 'na' | 'paid' | 'canceled' | 'liked' | 'disliked'
}