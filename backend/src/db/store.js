const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const config = require('../config');

// Ensure data folder exists
if (!fs.existsSync(config.DATA_DIR)) {
  fs.mkdirSync(config.DATA_DIR, { recursive: true });
}

// Initial seed catalog with premium Unsplash e-commerce photography
const getInitialSeeds = () => {
  const salt = bcrypt.genSaltSync(10);
  const demoPasswordHash = bcrypt.hashSync('password123', salt);
  const adminPasswordHash = bcrypt.hashSync('admin123', salt);

  return {
    users: [
      {
        id: 'usr_demo_1',
        name: 'Sophia Vance',
        email: 'demo@aura.com',
        password: demoPasswordHash,
        role: 'customer',
        createdAt: '2026-01-15T10:00:00Z'
      },
      {
        id: 'usr_admin_1',
        name: 'Marcus Sterling',
        email: 'admin@aura.com',
        password: adminPasswordHash,
        role: 'admin',
        createdAt: '2026-01-01T10:00:00Z'
      }
    ],
    coupons: [
      {
        code: 'WELCOME10',
        discountType: 'percentage',
        discountValue: 10,
        minOrderAmount: 50,
        description: '10% off your entire order (Min $50)'
      },
      {
        code: 'AURA20',
        discountType: 'percentage',
        discountValue: 20,
        minOrderAmount: 150,
        description: '20% off luxury orders over $150'
      },
      {
        code: 'FLAT30',
        discountType: 'fixed',
        discountValue: 30,
        minOrderAmount: 200,
        description: 'Flat $30 discount on orders over $200'
      }
    ],
    products: [
      {
        id: 'prod_1',
        title: 'Aura Studio Wireless ANC Headphones',
        category: 'Electronics',
        price: 299.00,
        originalPrice: 349.00,
        rating: 4.9,
        reviewsCount: 128,
        inStock: true,
        stockQuantity: 24,
        featured: true,
        badge: 'Best Seller',
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
        gallery: [
          'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=800&q=80'
        ],
        shortDescription: 'Active noise-cancelling wireless headphones with 40mm beryllium drivers and 36-hour battery.',
        description: 'Immerse yourself in acoustic perfection. Aura Studio ANC integrates custom 40mm beryllium acoustic transducers with ultra-low latency spatial audio tracking. Features plush memory foam earcups clad in breathable protein leather, fast USB-C charging, and multipoint Bluetooth 5.4 connectivity.',
        features: [
          '40mm custom beryllium acoustic drivers',
          'Hybrid 4-mic active noise cancellation with transparency mode',
          'Up to 38 hours playback with ANC enabled',
          'Bluetooth 5.4 with LDAC & aptX Lossless support',
          'Aircraft-grade anodized aluminum frame'
        ],
        colors: ['Matte Obsidian', 'Silver Titanium', 'Champagne Gold'],
        createdAt: '2026-02-01T12:00:00Z',
        reviews: [
          {
            id: 'rev_1',
            userName: 'Elena Rostova',
            rating: 5,
            date: '2026-03-12',
            comment: 'Unrivaled clarity. The noise cancelling effortlessly silences jet engine hum during long flights.'
          },
          {
            id: 'rev_2',
            userName: 'Daniel K.',
            rating: 5,
            date: '2026-03-05',
            comment: 'Premium build quality. The headband does not cause fatigue even after 8 hours of studio mixing.'
          }
        ]
      },
      {
        id: 'prod_2',
        title: 'Chronos Sapphire Minimalist Smartwatch',
        category: 'Electronics',
        price: 389.00,
        originalPrice: 420.00,
        rating: 4.8,
        reviewsCount: 94,
        inStock: true,
        stockQuantity: 18,
        featured: true,
        badge: 'Trending',
        image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80',
        gallery: [
          'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=800&q=80'
        ],
        shortDescription: 'Ultra-thin titanium case with sapphire crystal glass, continuous ECG, and 14-day battery.',
        description: 'Seamlessly marrying timeless horology with intelligent biomonitoring. Chronos Sapphire is machined from grade-5 titanium alloy and protected by anti-reflective synthetic sapphire crystal. Tracks heart rate variability, SpO2, and sleep architectures.',
        features: [
          'Grade 5 titanium alloy case with sapphire crystal',
          'Always-on 1.4-inch AMOLED display (1,200 nits)',
          'Continuous biometric monitoring with SpO2 and ECG',
          '5ATM water resistance rating (up to 50 meters)',
          '14-day typical battery longevity'
        ],
        colors: ['Titanium Gray', 'Space Black', 'Midnight Navy'],
        createdAt: '2026-02-03T12:00:00Z',
        reviews: [
          {
            id: 'rev_3',
            userName: 'Marcus Lin',
            rating: 5,
            date: '2026-03-10',
            comment: 'Battery genuinely lasts two full weeks on a single charge. Gorgeous watch face selection.'
          }
        ]
      },
      {
        id: 'prod_3',
        title: 'Artisan Cashmere Minimalist Overcoat',
        category: 'Fashion',
        price: 495.00,
        originalPrice: 580.00,
        rating: 4.9,
        reviewsCount: 62,
        inStock: true,
        stockQuantity: 12,
        featured: true,
        badge: 'Exclusive',
        image: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=800&q=80',
        gallery: [
          'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80'
        ],
        shortDescription: 'Double-faced 100% Mongolian cashmere tailored with clean lapels and horn buttons.',
        description: 'Masterfully woven from sustainably sourced Mongolian grade-A cashmere fibers. Unstructured lightweight construction provides warm insulation without bulk. Features hand-finished pick stitching and genuine horn buttons.',
        features: [
          '100% Grade-A Mongolian cashmere (450 GSM)',
          'Hand-finished double-face construction',
          'Interior welt pocket tailored for smartphones and passport',
          'Natural water-repellent finishing',
          'Dry clean only'
        ],
        colors: ['Camel Heather', 'Charcoal Melange', 'Oatmeal'],
        sizes: ['S', 'M', 'L', 'XL'],
        createdAt: '2026-02-05T12:00:00Z',
        reviews: [
          {
            id: 'rev_4',
            userName: 'Camilla Moreau',
            rating: 5,
            date: '2026-02-28',
            comment: 'Incredible drape and softness. Worth every penny for a timeless winter staple.'
          }
        ]
      },
      {
        id: 'prod_4',
        title: 'Verona Full-Grain Leather Weekender Bag',
        category: 'Accessories',
        price: 345.00,
        originalPrice: 395.00,
        rating: 4.9,
        reviewsCount: 88,
        inStock: true,
        stockQuantity: 15,
        featured: true,
        badge: 'Staff Pick',
        image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80',
        gallery: [
          'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=800&q=80'
        ],
        shortDescription: 'Handcrafted Tuscan vegetable-tanned leather duffle with dedicated shoe compartment.',
        description: 'Engineered for seamless 72-hour weekend getaways. Cut from thick full-grain Italian leather that patinas gracefully over years of travel. Features heavy-duty YKK Excella brass zippers, a padded 16-inch laptop pocket, and waterproof ventilated shoe compartment.',
        features: [
          'Vegetable-tanned full-grain Tuscan cowhide leather',
          'Reinforced bottom panel with solid brass protective feet',
          'Detachable padded ergonomic shoulder strap',
          'Dedicated side zippered ventilated shoe sleeve',
          'Meets international airline carry-on dimensions'
        ],
        colors: ['Cognac Tan', 'Espresso Brown', 'Onyx Black'],
        createdAt: '2026-02-08T12:00:00Z',
        reviews: [
          {
            id: 'rev_5',
            userName: 'Oliver Hayes',
            rating: 5,
            date: '2026-03-01',
            comment: 'Traveled through three continents with this bag. The leather is aging like fine wine.'
          }
        ]
      },
      {
        id: 'prod_5',
        title: 'Aura Horizon Mechanical Wireless Keyboard',
        category: 'Electronics',
        price: 185.00,
        originalPrice: 210.00,
        rating: 4.7,
        reviewsCount: 145,
        inStock: true,
        stockQuantity: 30,
        featured: false,
        badge: 'Popular',
        image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80',
        gallery: [
          'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80'
        ],
        shortDescription: 'Gasket-mounted hot-swappable 75% mechanical keyboard with CNC aluminum chassis.',
        description: 'Engineered for tactile acoustic bliss. Multi-layer Poron sound dampening with factory-lubricated linear switches and dye-sublimated PBT keycaps. Tri-mode connectivity (2.4GHz wireless, Bluetooth 5.2, USB-C).',
        features: [
          'CNC milled anodized aluminum case (1.8kg)',
          'Gasket mount architecture with flexible polycarbonate plate',
          'Hot-swappable PCB supporting 3-pin & 5-pin MX switches',
          '4,000 mAh rechargeable battery (up to 200 hours wireless)',
          'Per-key south-facing RGB with custom QMK/VIA web configurator'
        ],
        colors: ['Frost White', 'Space Charcoal', 'Forest Moss'],
        createdAt: '2026-02-10T12:00:00Z',
        reviews: [
          {
            id: 'rev_6',
            userName: 'Sarah Jenkins',
            rating: 5,
            date: '2026-02-25',
            comment: 'The acoustic profile is deep and creamy straight out of the box. Zero rattle.'
          }
        ]
      },
      {
        id: 'prod_6',
        title: 'Nordic Ceramic Slow Pour-Over Dripper Set',
        category: 'Living',
        price: 78.00,
        originalPrice: 92.00,
        rating: 4.8,
        reviewsCount: 51,
        inStock: true,
        stockQuantity: 40,
        featured: false,
        badge: 'New',
        image: 'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?auto=format&fit=crop&w=800&q=80',
        gallery: [
          'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?auto=format&fit=crop&w=800&q=80'
        ],
        shortDescription: 'Handcrafted stoneware carafe and conical dripper with walnut insulating collar.',
        description: 'Elevate your morning coffee ritual. High-density fired stoneware maintains optimal thermal retention during blooming and extraction. Includes 600ml borosilicate glass decanter and solid walnut wood collar.',
        features: [
          'Hand-glazed ceramic dripper with spiral flow ridges',
          'Heat-resistant 600ml borosilicate glass decanter',
          'Sustainably harvested American walnut collar with brass rivet',
          'Compatible with standard V60-02 paper and metal filters',
          'Dishwasher safe decanter'
        ],
        colors: ['Matte Speckled Cream', 'Smoked Slate', 'Terracotta'],
        createdAt: '2026-02-12T12:00:00Z',
        reviews: [
          {
            id: 'rev_7',
            userName: 'Mateo Rossi',
            rating: 5,
            date: '2026-03-02',
            comment: 'Delivers a remarkably clean cup of single-origin Ethiopian roast. Looks stunning on kitchen counters.'
          }
        ]
      },
      {
        id: 'prod_7',
        title: 'Luxe Merino Ribbed Crewneck Sweater',
        category: 'Fashion',
        price: 165.00,
        originalPrice: 195.00,
        rating: 4.7,
        reviewsCount: 77,
        inStock: true,
        stockQuantity: 22,
        featured: false,
        badge: 'Limited',
        image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=800&q=80',
        gallery: [
          'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=800&q=80'
        ],
        shortDescription: '100% extra-fine Italian merino wool sweater with thermo-regulating weave.',
        description: 'A versatile mid-layer staple woven in Biella, Italy. The ultrafine 19.5-micron fibers eliminate skin itchiness while naturally repelling odor and regulating temperature across all seasons.',
        features: [
          '100% extrafine Merino wool from Zegna Baruffa mills',
          'Ribbed collar, cuffs, and hem that retain memory shape',
          'Breathable and naturally antibacterial',
          'Tailored modern silhouette',
          'Hand wash cold or gentle wool cycle'
        ],
        colors: ['Deep Olive', 'Heather Charcoal', 'Navy Midnight'],
        sizes: ['S', 'M', 'L', 'XL'],
        createdAt: '2026-02-15T12:00:00Z',
        reviews: [
          {
            id: 'rev_8',
            userName: 'David Chen',
            rating: 4,
            date: '2026-02-20',
            comment: 'Great fit across the shoulders. Super soft on bare skin.'
          }
        ]
      },
      {
        id: 'prod_8',
        title: 'Aura Pure Ultrasonic Stone Diffuser',
        category: 'Living',
        price: 110.00,
        originalPrice: 130.00,
        rating: 4.8,
        reviewsCount: 63,
        inStock: true,
        stockQuantity: 28,
        featured: false,
        badge: 'Wellness',
        image: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=800&q=80',
        gallery: [
          'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=800&q=80'
        ],
        shortDescription: 'Matte ceramic stoneware essential oil diffuser with ambient warm LED glow.',
        description: 'Turn your sanctuary into a restorative spa. Employs 2.4MHz ultrasonic oscillations to atomize water and essential oils without heating, preserving organic therapeutic botanicals. Features customizable continuous or intermittent timers.',
        features: [
          'Handcrafted porcelain ceramic matte exterior',
          'BPA-free internal water reservoir (200ml)',
          'Quiet ultrasonic operation (<20dB)',
          'Dual mist modes: 4-hour continuous or 8-hour intermittent',
          'Subtle warm ambient night light'
        ],
        colors: ['Porecelain Sand', 'Basalt Charcoal', 'Terracotta Clay'],
        createdAt: '2026-02-18T12:00:00Z',
        reviews: [
          {
            id: 'rev_9',
            userName: 'Chloe Bennett',
            rating: 5,
            date: '2026-03-01',
            comment: 'Fills our master bedroom with subtle lavender mist. Elegant sculptural addition to our dresser.'
          }
        ]
      },
      {
        id: 'prod_9',
        title: 'Solaris Polarized Acetate Sunglasses',
        category: 'Accessories',
        price: 175.00,
        originalPrice: 210.00,
        rating: 4.9,
        reviewsCount: 91,
        inStock: true,
        stockQuantity: 19,
        featured: true,
        badge: 'Summer Edit',
        image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=800&q=80',
        gallery: [
          'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=800&q=80'
        ],
        shortDescription: 'Hand-cut Italian Mazzucchelli acetate frames with Zeiss polarized UV400 lenses.',
        description: 'Sculpted by hand in Northern Italy. Fitted with premium Carl Zeiss polarized polyamide lenses that deliver razor-sharp optical clarity while repelling glare, oils, and scratches.',
        features: [
          'Custom Mazzucchelli bio-acetate frame',
          'Carl Zeiss polarized CR-39 lenses with 100% UV400 defense',
          'Five-barrel German engineered hinges with Teflon screws',
          'Includes hard leather carrying case and microfiber cloth'
        ],
        colors: ['Honey Havana', 'Gloss Black', 'Crystal Amber'],
        createdAt: '2026-02-20T12:00:00Z',
        reviews: [
          {
            id: 'rev_10',
            userName: 'Alexander W.',
            rating: 5,
            date: '2026-02-27',
            comment: 'Crystal clear optics when driving in direct sunlight. The frame feels solid and well balanced.'
          }
        ]
      },
      {
        id: 'prod_10',
        title: 'Aura Soundbar 360 Dolby Atmos Spatial Speaker',
        category: 'Electronics',
        price: 450.00,
        originalPrice: 520.00,
        rating: 4.9,
        reviewsCount: 110,
        inStock: true,
        stockQuantity: 14,
        featured: true,
        badge: 'High Fidelity',
        image: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=800&q=80',
        gallery: [
          'https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=800&q=80'
        ],
        shortDescription: 'Cinematic 7-driver spatial audio array with eARC HDMI and wireless subwoofer sync.',
        description: 'Transform home entertainment into a true theatre experience. 360-degree beamforming acoustic waveguides calibrate room acoustics automatically via smartphone mic. Delivers thundering sub-bass down to 32Hz.',
        features: [
          '7 high-output neodymium drivers with dedicated central dialogue tweeter',
          'Dolby Atmos and DTS:X virtual 3D surround sound',
          'HDMI eARC 2.1, AirPlay 2, Spotify Connect, and Wi-Fi 6 streaming',
          'Kvadrat bespoke acoustic fabric grille',
          'Low profile under-TV clearance design'
        ],
        colors: ['Graphite Black', 'Silver Mist'],
        createdAt: '2026-02-22T12:00:00Z',
        reviews: [
          {
            id: 'rev_11',
            userName: 'Nathaniel Drake',
            rating: 5,
            date: '2026-03-04',
            comment: 'Movies sound unbelievable. Dialogue is crisp even during chaotic action scenes.'
          }
        ]
      },
      {
        id: 'prod_11',
        title: 'Minimalist Monolith Magnetic Wireless Charger',
        category: 'Electronics',
        price: 75.00,
        originalPrice: 90.00,
        rating: 4.6,
        reviewsCount: 82,
        inStock: true,
        stockQuantity: 35,
        featured: false,
        badge: 'Everyday Tech',
        image: 'https://images.unsplash.com/photo-1622445262464-84b1456045b6?auto=format&fit=crop&w=800&q=80',
        gallery: [
          'https://images.unsplash.com/photo-1622445262464-84b1456045b6?auto=format&fit=crop&w=800&q=80'
        ],
        shortDescription: 'Solid machined aluminum 3-in-1 fast charger for phone, smartwatch, and earbuds.',
        description: 'Tidy up your workspace. Machined from a single block of aerospace aluminum with weighted anti-slip silicone base. Strong N52 neodymium magnets align devices instantly with 15W Qi2 fast charging.',
        features: [
          'Full 15W Qi2 certified magnetic fast charging',
          'Simultaneous 3-device charging (Phone, Watch, Buds)',
          'Heavyweight zinc alloy base stays planted during one-handed removal',
          'Braided 2-meter USB-C power delivery cable included'
        ],
        colors: ['Space Gray', 'Silver Aluminum'],
        createdAt: '2026-02-24T12:00:00Z',
        reviews: [
          {
            id: 'rev_12',
            userName: 'Hannah Kim',
            rating: 5,
            date: '2026-02-28',
            comment: 'Finally replaced the 3 ugly cables on my bedside table. MagSafe hold is super strong.'
          }
        ]
      },
      {
        id: 'prod_12',
        title: 'Portofino Minimalist Leather Sneakers',
        category: 'Fashion',
        price: 220.00,
        originalPrice: 260.00,
        rating: 4.8,
        reviewsCount: 139,
        inStock: true,
        stockQuantity: 25,
        featured: false,
        badge: 'Best Seller',
        image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=800&q=80',
        gallery: [
          'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=800&q=80'
        ],
        shortDescription: 'Hand-stitched Italian calfskin leather trainers with Margom rubber cupsole.',
        description: 'The epitome of refined casual luxury. Built on iconic Italian Margom rubber soles, crafted from supple full-grain nappa calfskin, lined in smooth calf leather for sockless breathability.',
        features: [
          'Full-grain Italian calfskin leather upper',
          'Authentic Margom vulcanized rubber outsole',
          'Orthotic memory foam insole lined with perforated leather',
          'Hand-stitched side-wall construction for lifetime durability'
        ],
        colors: ['Triple Crisp White', 'White & Suede Grey', 'White & Navy Tab'],
        sizes: ['US 8', 'US 9', 'US 10', 'US 11', 'US 12'],
        createdAt: '2026-02-26T12:00:00Z',
        reviews: [
          {
            id: 'rev_13',
            userName: 'Julian Vance',
            rating: 5,
            date: '2026-03-03',
            comment: 'No break-in period required. Incredibly comfortable and goes with everything from jeans to suits.'
          }
        ]
      }
    ],
    orders: [
      {
        id: 'ord_1001',
        userId: 'usr_demo_1',
        customerName: 'Sophia Vance',
        customerEmail: 'demo@aura.com',
        shippingAddress: {
          fullName: 'Sophia Vance',
          street: '742 Evergreen Terrace',
          city: 'San Francisco',
          state: 'CA',
          postalCode: '94107',
          country: 'United States',
          phone: '+1 (555) 019-2834'
        },
        items: [
          {
            productId: 'prod_1',
            title: 'Aura Studio Wireless ANC Headphones',
            image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
            price: 299.00,
            quantity: 1,
            selectedColor: 'Matte Obsidian'
          },
          {
            productId: 'prod_8',
            title: 'Aura Pure Ultrasonic Stone Diffuser',
            image: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=800&q=80',
            price: 110.00,
            quantity: 1,
            selectedColor: 'Porecelain Sand'
          }
        ],
        subtotal: 409.00,
        discountAmount: 40.90,
        appliedCoupon: 'WELCOME10',
        shippingFee: 0.00,
        taxAmount: 29.45,
        totalAmount: 397.55,
        status: 'shipped',
        paymentMethod: 'Credit Card (Simulated)',
        trackingNumber: 'AUR-9842104-EXP',
        estimatedDelivery: '2026-11-08',
        createdAt: '2026-11-01T14:32:00Z'
      }
    ]
  };
};

// Database store manager with atomic writes
class DataStore {
  constructor() {
    this.filePath = config.DB_FILE;
    this.data = null;
    this.init();
  }

  init() {
    try {
      if (fs.existsSync(this.filePath)) {
        const fileContent = fs.readFileSync(this.filePath, 'utf8');
        this.data = JSON.parse(fileContent);
      } else {
        this.data = getInitialSeeds();
        this.persist();
      }
    } catch (err) {
      console.error('Error loading database, creating fresh seeds:', err);
      this.data = getInitialSeeds();
      this.persist();
    }
  }

  persist() {
    try {
      const tempPath = `${this.filePath}.tmp`;
      fs.writeFileSync(tempPath, JSON.stringify(this.data, null, 2), 'utf8');
      fs.renameSync(tempPath, this.filePath);
    } catch (err) {
      console.error('Failed to persist database:', err);
    }
  }

  // --- Users ---
  getUsers() {
    return this.data.users || [];
  }

  findUserByEmail(email) {
    if (!email) return null;
    return this.getUsers().find(u => u.email.toLowerCase() === email.toLowerCase());
  }

  findUserById(id) {
    return this.getUsers().find(u => u.id === id);
  }

  createUser(userData) {
    const newUser = {
      id: `usr_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      role: 'customer',
      createdAt: new Date().toISOString(),
      ...userData
    };
    this.data.users.push(newUser);
    this.persist();
    return newUser;
  }

  // --- Products ---
  getProducts() {
    return this.data.products || [];
  }

  findProductById(id) {
    return this.getProducts().find(p => p.id === id);
  }

  createProduct(productData) {
    const newProduct = {
      id: `prod_${Date.now()}`,
      rating: 5.0,
      reviewsCount: 0,
      reviews: [],
      inStock: true,
      createdAt: new Date().toISOString(),
      ...productData
    };
    this.data.products.unshift(newProduct);
    this.persist();
    return newProduct;
  }

  updateProduct(id, updates) {
    const index = this.data.products.findIndex(p => p.id === id);
    if (index === -1) return null;
    this.data.products[index] = { ...this.data.products[index], ...updates };
    this.persist();
    return this.data.products[index];
  }

  deleteProduct(id) {
    const index = this.data.products.findIndex(p => p.id === id);
    if (index === -1) return false;
    this.data.products.splice(index, 1);
    this.persist();
    return true;
  }

  addReview(productId, reviewData) {
    const product = this.findProductById(productId);
    if (!product) return null;
    
    if (!product.reviews) product.reviews = [];
    const review = {
      id: `rev_${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      ...reviewData
    };
    product.reviews.unshift(review);
    
    // Recalculate average rating
    const totalRating = product.reviews.reduce((acc, r) => acc + Number(r.rating), 0);
    product.rating = Number((totalRating / product.reviews.length).toFixed(1));
    product.reviewsCount = product.reviews.length;
    
    this.persist();
    return review;
  }

  // --- Coupons ---
  getCoupons() {
    return this.data.coupons || [];
  }

  findCouponByCode(code) {
    if (!code) return null;
    return this.getCoupons().find(c => c.code.toUpperCase() === code.trim().toUpperCase());
  }

  // --- Orders ---
  getOrders() {
    return this.data.orders || [];
  }

  findOrderById(id) {
    return this.getOrders().find(o => o.id === id);
  }

  findOrdersByUserId(userId) {
    return this.getOrders().filter(o => o.userId === userId);
  }

  createOrder(orderData) {
    const newOrder = {
      id: `ord_${Date.now()}`,
      status: 'processing',
      trackingNumber: `AUR-${Math.floor(1000000 + Math.random() * 9000000)}-EXP`,
      createdAt: new Date().toISOString(),
      ...orderData
    };
    this.data.orders.unshift(newOrder);

    // Decrement product inventory
    if (Array.isArray(newOrder.items)) {
      newOrder.items.forEach(item => {
        const prod = this.findProductById(item.productId);
        if (prod && typeof prod.stockQuantity === 'number') {
          prod.stockQuantity = Math.max(0, prod.stockQuantity - item.quantity);
          if (prod.stockQuantity === 0) prod.inStock = false;
        }
      });
    }

    this.persist();
    return newOrder;
  }

  updateOrderStatus(orderId, status) {
    const order = this.findOrderById(orderId);
    if (!order) return null;
    order.status = status;
    this.persist();
    return order;
  }

  // --- Analytics ---
  getAnalytics() {
    const orders = this.getOrders();
    const products = this.getProducts();

    const totalRevenue = orders.reduce((acc, o) => acc + (o.totalAmount || 0), 0);
    const totalOrders = orders.length;
    const totalProducts = products.length;
    const lowStockCount = products.filter(p => (p.stockQuantity || 0) < 15).length;

    // Revenue by category
    const categorySales = {};
    orders.forEach(order => {
      (order.items || []).forEach(item => {
        const prod = this.findProductById(item.productId);
        const cat = prod ? prod.category : 'General';
        categorySales[cat] = (categorySales[cat] || 0) + (item.price * item.quantity);
      });
    });

    return {
      totalRevenue: Number(totalRevenue.toFixed(2)),
      totalOrders,
      totalProducts,
      lowStockCount,
      categorySales,
      recentOrders: orders.slice(0, 5)
    };
  }
}

module.exports = new DataStore();
