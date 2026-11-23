import './style.css'

const app = document.querySelector<HTMLDivElement>('#app')
const price: number = 1300
const total = price + "500" // 送料を足す
if (app) app.textContent = `合計 ${total} 円`
