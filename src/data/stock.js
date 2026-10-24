/** A small, tucked-away library of scene images so every AU looks good from day one. */
export const STOCK = [
  { id: 'cafe', label: 'Café window', src: 'media/stock/cafe.jpg', tags: ['café', 'day', 'warm'] },
  { id: 'city', label: 'Neon street', src: 'media/stock/city.jpg', tags: ['city', 'night', 'rain'] },
  { id: 'vinyl', label: 'Record player', src: 'media/stock/vinyl.jpg', tags: ['music', 'warm'] },
  { id: 'rooftop', label: 'Rooftop dusk', src: 'media/stock/rooftop.jpg', tags: ['city', 'dusk'] },
  { id: 'beach', label: 'Beach sunset', src: 'media/stock/beach.jpg', tags: ['beach', 'sunset'] },
  { id: 'flowers', label: 'Flowers & notes', src: 'media/stock/flowers.jpg', tags: ['soft', 'day'] },
  { id: 'neon', label: 'Neon sign', src: 'media/stock/neon.jpg', tags: ['night', 'moody'] },
  { id: 'coffee', label: 'Coffee on table', src: 'media/stock/coffee.jpg', tags: ['café', 'detail'] },
  { id: 'books', label: 'Old books', src: 'media/stock/books.jpg', tags: ['library', 'soft'] },
  { id: 'street', label: 'City street', src: 'media/stock/street.jpg', tags: ['day', 'city'] },
  { id: 'concert', label: 'Concert lights', src: 'media/stock/concert.jpg', tags: ['music', 'night'] },
  { id: 'train', label: 'Train window', src: 'media/stock/train.jpg', tags: ['travel', 'soft'] },
  { id: 'motel', label: 'Motel lights', src: 'media/stock/motel.jpg', tags: ['night', 'americana'] },
  { id: 'rain', label: 'Rain on glass', src: 'media/stock/rain.jpg', tags: ['moody', 'rain'] },
]

export const stockSrc = (id) => STOCK.find((s) => s.id === id)?.src || ''
