export const products = [
  {
    id: "p1",
    name: "Ramo de Tulipanes Eternos",
    category: "Limpiapipas",
    occasion: "Aniversario",
    price: 45.00,
    prepTime: "2 días",
    image: "https://images.unsplash.com/photo-1526047932273-341f2a7631f9?auto=format&fit=crop&w=600&q=80",
    description: "6 tulipanes confeccionados a mano en limpiapipas velvet súper suave, envueltos en papel coreano rosado con lazo de satén.",
    details: ["Insumos: Limpiapipas terciopelo de alta densidad", "Incluye tarjeta dedicatoria en papel perlado", "Empaque de protección antichoque"],
    featured: true
  },
  {
    id: "p2",
    name: "Abejita Amigurumi en Cúpula",
    category: "Amigurumis",
    occasion: "Cumpleaños",
    price: 38.00,
    prepTime: "3 días",
    image: "https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=600&q=80",
    description: "Tejida a mano en hilo de algodón 100% hipoalergénico. Montada en cúpula transparente con mini base de madera noble.",
    details: ["Lana: Algodón peinado premium", "Dimensiones: 15cm alto", "Cúpula protectora lavable"],
    featured: true
  },
  {
    id: "p3",
    name: "Rosa Tejida Individual Royale",
    category: "Crochet",
    occasion: "Aniversario",
    price: 25.00,
    prepTime: "1 día",
    image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80",
    description: "Rosa eterna tejida al crochet con detalles finos en hojas de verde olivo y mensaje personalizado grabado.",
    details: ["Eterna: Nunca se marchita", "Aroma opcional a vainilla o rosas", "Envoltura individual con cinta dorada"],
    featured: false
  },
  {
    id: "p4",
    name: "Box Regalo Snoopy & Flores LED",
    category: "Cajas de Regalo",
    occasion: "Sorpresa",
    price: 68.00,
    prepTime: "3 días",
    image: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=600&q=80",
    description: "Caja rígida pastel desplegable con figura artesanal de Snoopy en limpiapipas, luces LED cálidas y flores variadas.",
    details: ["Incluye luces LED con baterías incluidas", "Caja con cierre magnético", "Personalización de texto interna"],
    featured: true
  },
  {
    id: "p5",
    name: "Ramo Radiante de Girasoles",
    category: "Limpiapipas",
    occasion: "Graduación",
    price: 75.00,
    prepTime: "2 días",
    image: "https://images.unsplash.com/photo-1597848212624-a19eb35e2651?auto=format&fit=crop&w=600&q=80",
    description: "3 girasoles majestuosos acompañados de finas espigas y hojas verdes en limpiapipas de durabilidad eterna.",
    details: ["Tallo flexible reinforced", "Envoltura pastel bicolor", "Tarjeta de felicitaciones graduación/logro"],
    featured: false
  },
  {
    id: "p6",
    name: "Osito Cariñoso Amigurumi",
    category: "Amigurumis",
    occasion: "Cumpleaños",
    price: 42.00,
    prepTime: "3 días",
    image: "https://images.unsplash.com/photo-1558679908-541bcf1249ff?auto=format&fit=crop&w=600&q=80",
    description: "Adorable osito tejido con detalles pastel en orejitas y corazón acolchado en el pecho.",
    details: ["Relleno siliconado antialérgico", "Ojos de seguridad a prueba de niños", "Lavable en ciclo suave"],
    featured: false
  },
  {
    id: "p7",
    name: "Bouquet Lavanda & Margaritas",
    category: "Crochet",
    occasion: "Sorpresa",
    price: 55.00,
    prepTime: "2 días",
    image: "https://images.unsplash.com/photo-1561181286-d3fee7d55364?auto=format&fit=crop&w=600&q=80",
    description: "Elegante arreglo en tonos lilas y blancos. Tejido ultra fino que emula la belleza natural silvestre.",
    details: ["Flores: 5 espigas de lavanda + 3 margaritas", "Aroma relajante a lavanda natural", "Envoltura estilo vintage"],
    featured: false
  },
  {
    id: "p8",
    name: "Caja Corazón Delicia Floral",
    category: "Cajas de Regalo",
    occasion: "Aniversario",
    price: 85.00,
    prepTime: "3 días",
    image: "https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=600&q=80",
    description: "Edición especial: Caja corazón con bouquet mixto de tulipanes e hilos de plata, luces de hada y tarjeta desplegable.",
    details: ["Caja rígida de lujo con cinta satinada", "Guirnalda de luz de hadas", "Nota hecha a caligrafía artística"],
    featured: true
  }
];

// --- MÉTODOS AUXILIARES Y DE BÚSQUEDA ---

export function getProductById(id) {
  return products.find(product => product.id === id);
}

export function getFeaturedProducts() {
  return products.filter(product => product.featured);
}

export function getCategories() {
  return ["Todas", ...new Set(products.map(p => p.category))];
}

export function getOccasions() {
  return ["Todas", ...new Set(products.map(p => p.occasion))];
}