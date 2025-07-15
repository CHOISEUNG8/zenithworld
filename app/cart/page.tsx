"use client"

import { useState, useEffect } from "react"

interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  addedAt?: number
  image?: string
  brand?: string
}

const CartPage = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [totalPrice, setTotalPrice] = useState(0)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)

  useEffect(() => {
    // 로그인 상태 확인
    const cookieToken = document.cookie.includes("token=") || document.cookie.includes("auth-token=")
    const localToken = localStorage.getItem("auth-token")
    const userId = localStorage.getItem("current-user-id")
    const userLoggedIn = cookieToken || !!localToken

    setIsLoggedIn(userLoggedIn)
    setCurrentUserId(userId)

    // 로그인하지 않은 경우 장바구니 비우기
    if (!userLoggedIn || !userId) {
      setCartItems([])
      return
    }

    // Retrieve cart items from local storage on component mount
    const cartKey = `cartItems_${userId}`
    const storedCartItems = localStorage.getItem(cartKey)
    if (storedCartItems) {
      try {
        const parsedItems = JSON.parse(storedCartItems)
        const now = new Date().getTime()

        // Filter items that are within 7 days
        const validItems = parsedItems.filter((item: CartItem & { addedAt?: number }) => {
          const addedTime = item.addedAt || now
          const daysDiff = (now - addedTime) / (1000 * 60 * 60 * 24)
          return daysDiff <= 7
        })

        // Update localStorage if some items were filtered out
        if (validItems.length !== parsedItems.length) {
          localStorage.setItem(cartKey, JSON.stringify(validItems))
        }

        setCartItems(validItems)
      } catch (error) {
        console.error("Error parsing cart items:", error)
        setCartItems([])
      }
    }
  }, [])

  useEffect(() => {
    // 로그인하지 않은 경우 장바구니 관련 작업 중단
    if (!isLoggedIn || !currentUserId) {
      setTotalPrice(0)
      return
    }

    // Update total price whenever cart items change
    const newTotalPrice = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0)
    setTotalPrice(newTotalPrice)

    // Add timestamp when saving to localStorage
    const cartItemsWithTimestamp = cartItems.map((item) => ({
      ...item,
      addedAt: item.addedAt || new Date().getTime(),
    }))

    const cartKey = `cartItems_${currentUserId}`
    localStorage.setItem(cartKey, JSON.stringify(cartItemsWithTimestamp))

    // Dispatch custom event to notify header of cart changes
    window.dispatchEvent(new CustomEvent("cartUpdated"))
  }, [cartItems, isLoggedIn, currentUserId])

  const handleQuantityChange = (id: string, newQuantity: number) => {
    if (newQuantity < 0 || !isLoggedIn || !currentUserId) return

    const updatedCartItems = cartItems.map((item) => (item.id === id ? { ...item, quantity: newQuantity } : item))
    setCartItems(updatedCartItems)
  }

  const handleRemoveItem = (id: string) => {
    if (!isLoggedIn || !currentUserId) return

    const updatedCartItems = cartItems.filter((item) => item.id !== id)
    setCartItems(updatedCartItems)
  }

  const handleClearCart = () => {
    if (!isLoggedIn || !currentUserId) return

    setCartItems([])
  }

  // 로그인하지 않은 경우 로그인 안내 메시지 표시
  if (!isLoggedIn) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">장바구니</h1>
        <div className="text-center py-8">
          <p className="text-gray-600 mb-4">장바구니를 이용하려면 로그인이 필요합니다.</p>
          <a href="/login" className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 inline-block">
            로그인하기
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">장바구니</h1>
      {cartItems.length === 0 ? (
        <p>장바구니가 비어 있습니다.</p>
      ) : (
        <>
          <ul>
            {cartItems.map((item) => (
              <li key={item.id} className="flex items-center justify-between py-4 border-b">
                <div className="flex items-center space-x-4">
                  <input type="checkbox" className="mr-2" />
                  {item.image && (
                    <img
                      src={item.image || "/placeholder.svg"}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                  )}
                  <div className="flex flex-col flex-1">
                    <span className="font-semibold text-lg">{item.name}</span>
                    {item.brand && <span className="text-sm text-gray-500">{item.brand}</span>}
                    <span className="text-blue-600 font-semibold">{item.price.toLocaleString()}원</span>
                    <div className="flex items-center mt-2">
                      <button
                        onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                        className="bg-gray-200 px-3 py-1 rounded hover:bg-gray-300"
                      >
                        -
                      </button>
                      <input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => handleQuantityChange(item.id, Number.parseInt(e.target.value))}
                        className="mx-2 w-16 text-center border rounded px-2 py-1"
                        min="1"
                      />
                      <button
                        onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                        className="bg-gray-200 px-3 py-1 rounded hover:bg-gray-300"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-lg mb-2">{(item.price * item.quantity).toLocaleString()}원</div>
                  <button
                    onClick={() => handleRemoveItem(item.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-700"
                  >
                    삭제
                  </button>
                </div>
              </li>
            ))}
          </ul>
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <div className="flex justify-between items-center text-xl font-bold">
              <span>총 가격:</span>
              <span className="text-blue-600">{totalPrice.toLocaleString()}원</span>
            </div>
            <div className="mt-4 flex gap-4">
              <button
                onClick={handleClearCart}
                className="flex-1 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                장바구니 비우기
              </button>
              <button className="flex-1 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">주문하기</button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default CartPage
