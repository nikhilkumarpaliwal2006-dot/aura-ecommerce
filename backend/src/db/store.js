const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const config = require('../config');

// Mongoose Models
const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');
const Coupon = require('../models/Coupon');

// Ensure data folder exists
if (!fs.existsSync(config.DATA_DIR)) {
  fs.mkdirSync(config.DATA_DIR, { recursive: true });
}

// Initial seed catalog with premium Unsplash photography and Indian Rupee (₹) pricing
const getInitialSeeds = () => {
  const salt = bcrypt.genSaltSync(10);
  const demoPasswordHash = bcrypt.hashSync('password123', salt);
  const adminPasswordHash = bcrypt.hashSync('admin123', salt);

  return {
    users: [
      {
        id: 'usr_demo_1',
        name: 'Sophia Vance',
        email: 'demo@nikkaura.com',
        password: demoPasswordHash,
        role: 'customer',
        createdAt: '2026-01-15T10:00:00Z'
      },
      {
        id: 'usr_admin_1',
        name: 'Nikhil Paliwal',
        email: 'admin@nikkaura.com',
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
        minOrderAmount: 2000,
        description: '10% off your entire order (Min ₹2,000)'
      },
      {
        code: 'NIKK20',
        discountType: 'percentage',
        discountValue: 20,
        minOrderAmount: 10000,
        description: '20% off luxury orders over ₹10,000'
      },
      {
        code: 'FLAT1500',
        discountType: 'fixed',
        discountValue: 1500,
        minOrderAmount: 15000,
        description: 'Flat ₹1,500 discount on orders over ₹15,000'
      },
      {
        code: 'ROYAL5000',
        discountType: 'fixed',
        discountValue: 5000,
        minOrderAmount: 40000,
        description: 'Flat ₹5,000 off on Haute Horology & Fine Jewelry above ₹40,000'
      }
    ],
    products: [
      {
        id: 'prod_1',
        title: 'NIKK AURA Studio Wireless ANC Headphones',
        category: 'Electronics',
        price: 24999.00,
        originalPrice: 29999.00,
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
        description: 'Immerse yourself in acoustic perfection. NIKK AURA Studio ANC integrates custom 40mm beryllium acoustic transducers with ultra-low latency spatial audio tracking. Features plush memory foam earcups clad in breathable protein leather, fast USB-C charging, and multipoint Bluetooth 5.4 connectivity.',
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
        price: 32490.00,
        originalPrice: 36990.00,
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
        price: 42500.00,
        originalPrice: 48000.00,
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
        price: 28900.00,
        originalPrice: 33500.00,
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
        title: 'NIKK AURA Horizon Mechanical Keyboard',
        category: 'Electronics',
        price: 15490.00,
        originalPrice: 17990.00,
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
        price: 6490.00,
        originalPrice: 7800.00,
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
        price: 13990.00,
        originalPrice: 16500.00,
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
        title: 'NIKK AURA Pure Ultrasonic Stone Diffuser',
        category: 'Living',
        price: 9490.00,
        originalPrice: 11200.00,
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
        price: 14900.00,
        originalPrice: 17900.00,
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
        title: 'NIKK AURA 360 Dolby Atmos Spatial Speaker',
        category: 'Electronics',
        price: 38000.00,
        originalPrice: 44000.00,
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
        price: 6200.00,
        originalPrice: 7500.00,
        rating: 4.8,
        reviewsCount: 96,
        inStock: true,
        stockQuantity: 35,
        featured: false,
        badge: 'Monolith Tech',
        image: '/images/charger.jpg',
        gallery: [
          '/images/charger.jpg',
          '/images/charger-stand.jpg',
          '/images/charger-dock.jpg'
        ],
        shortDescription: 'Solid machined monolithic aluminum magnetic fast charger for phone, smartwatch, and earbuds.',
        description: 'Tidy up your workspace with architectural precision. Machined from a single solid block of aerospace aluminum monolith with weighted anti-slip silicone base. Strong N52 neodymium magnets align devices instantly with 15W Qi2 fast charging.',
        features: [
          'Solid machined aerospace aluminum monolith puck design',
          'Full 15W Qi2 certified magnetic fast charging',
          'Simultaneous multi-device charging (Phone, Watch, Buds)',
          'Heavyweight anti-slip base stays planted during one-handed device removal',
          'Braided 2-meter USB-C power delivery cable included'
        ],
        colors: ['Silver Aluminum Monolith', 'Space Gray Anodized'],
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
        price: 18500.00,
        originalPrice: 22000.00,
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
      },
      {
        id: 'prod_13',
        title: 'Aura Royal 18K Yellow Gold Solitaire Ring',
        category: 'Fine Jewelry',
        price: 68000.00,
        originalPrice: 75000.00,
        rating: 5.0,
        reviewsCount: 38,
        inStock: true,
        stockQuantity: 7,
        featured: true,
        badge: 'Masterpiece',
        image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80',
        gallery: [
          'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80'
        ],
        shortDescription: 'Certified 1.5-carat lab-grown VVS1 brilliant cut diamond set in solid 18K gold.',
        description: 'Forged in ethical brilliance. Featuring an exquisite 1.5-carat center stone cut to ideal proportions for maximum light dispersion, set securely in a tapered six-prong solid 18K yellow gold band. Includes IGI certificate of authenticity.',
        features: [
          '18-karat recycled yellow gold hallmarked band',
          '1.5 Carat center diamond (Color D, Clarity VVS1)',
          'Hand-polished comfort fit shank',
          'Lifetime guarantee & complimentary annual ultrasonic cleaning'
        ],
        colors: ['18K Yellow Gold', '18K White Gold', '18K Rose Gold'],
        sizes: ['Size 6', 'Size 7', 'Size 8', 'Size 9'],
        createdAt: '2026-03-01T10:00:00Z',
        reviews: [
          {
            id: 'rev_14',
            userName: 'Aarav Singhania',
            rating: 5,
            date: '2026-03-10',
            comment: 'Breathtaking fire and brilliance. My fiancée was completely mesmerized.'
          }
        ]
      },
      {
        id: 'prod_14',
        title: 'Chronos Swiss Automatic Mechanical Tourbillon',
        category: 'Fine Jewelry',
        price: 84000.00,
        originalPrice: 95000.00,
        rating: 4.9,
        reviewsCount: 29,
        inStock: true,
        stockQuantity: 5,
        featured: true,
        badge: 'Collector Edition',
        image: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=800&q=80',
        gallery: [
          'https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=800&q=80'
        ],
        shortDescription: 'High-frequency automatic mechanical movement with open-heart skeleton escapement.',
        description: 'The pinnacle of micro-mechanical horology. Exhibiting 28,800 vibrations per hour with a 72-hour power reserve. Encased in surgical 316L stainless steel with double-domed scratchproof sapphire crystal on both front and exhibition caseback.',
        features: [
          'Custom caliber 28-jewel automatic movement',
          'Exhibition skeleton case back displaying blued screws and Geneva stripes',
          'Genuine alligator grain leather strap with butterfly deployant clasp',
          'Water resistant to 100 meters'
        ],
        colors: ['Obsidian Skeleton', 'Rose Gold Silver', 'Midnight Navy'],
        createdAt: '2026-03-03T11:00:00Z',
        reviews: [
          {
            id: 'rev_15',
            userName: 'Vikramaditya S.',
            rating: 5,
            date: '2026-03-14',
            comment: 'The sweeping second hand is hypnotic. Remarkable value for a skeleton mechanical.'
          }
        ]
      },
      {
        id: 'prod_15',
        title: 'Aura Santal Imperial Extrait de Parfum (100ml)',
        category: 'Fragrances',
        price: 16800.00,
        originalPrice: 19500.00,
        rating: 4.9,
        reviewsCount: 73,
        inStock: true,
        stockQuantity: 21,
        featured: true,
        badge: 'Niche Fragrance',
        image: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=800&q=80',
        gallery: [
          'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=800&q=80'
        ],
        shortDescription: 'Extrait de parfum featuring creamy Mysore sandalwood, cardamon, and smoky iris.',
        description: 'An unforgettable signature olfactory journey. Blended at an extraordinary 30% oil concentration for 16-hour sillage. Notes of aged Mysore sandalwood harmonize with Florentine iris, black cardamom, cedarwood, and bourbon vanilla.',
        features: [
          '30% Extrait de Parfum concentration',
          'Hand-bottled heavy crystal flacon with magnetic gold cap',
          'Cruelty-free, vegan, aged in Grasse, France',
          '100ml spray bottle with travel atomizer included'
        ],
        colors: ['Heavy Crystal 100ml'],
        createdAt: '2026-03-05T12:00:00Z',
        reviews: [
          {
            id: 'rev_16',
            userName: 'Zoya K.',
            rating: 5,
            date: '2026-03-11',
            comment: 'Lasts all day through dinner and evening events. Constantly getting compliments.'
          }
        ]
      },
      {
        id: 'prod_16',
        title: 'Venetian Pure Mulberry Silk Heritage Scarf',
        category: 'Fashion',
        price: 8900.00,
        originalPrice: 10500.00,
        rating: 4.8,
        reviewsCount: 45,
        inStock: true,
        stockQuantity: 18,
        featured: false,
        badge: 'Artisanal',
        image: 'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?auto=format&fit=crop&w=800&q=80',
        gallery: [
          'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?auto=format&fit=crop&w=800&q=80'
        ],
        shortDescription: '100% Grade 6A mulberry silk with hand-rolled hems and architectural gold motifs.',
        description: 'Woven from 19-momme pure mulberry silk for a featherlight sensuous drape. Hand-screened using non-toxic reactive dyes that produce radiant, fade-resistant color depth. Finished with hand-rolled and hand-sewn edges by Italian artisans.',
        features: [
          '100% Grade 6A pure mulberry silk (19 momme)',
          'Dimensions: 90cm x 90cm (35" x 35")',
          'Hand-rolled and hand-stitched borders',
          'Packaged in an embossed NIKK AURA presentation gift box'
        ],
        colors: ['Gold Baroque & Black', 'Emerald & Ivory', 'Crimson & Navy'],
        createdAt: '2026-03-07T12:00:00Z',
        reviews: [
          {
            id: 'rev_17',
            userName: 'Priya Sharma',
            rating: 5,
            date: '2026-03-12',
            comment: 'The silk has an exquisite weight and sheen. Beautiful packaging too.'
          }
        ]
      },
      {
        id: 'prod_17',
        title: 'Milano Carbon Fiber & Leather Slim Bifold',
        category: 'Accessories',
        price: 5400.00,
        originalPrice: 6500.00,
        rating: 4.7,
        reviewsCount: 88,
        inStock: true,
        stockQuantity: 45,
        featured: false,
        badge: 'EDC Essential',
        image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=800&q=80',
        gallery: [
          'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=800&q=80'
        ],
        shortDescription: 'Real 3K twill matte carbon fiber fused with full-grain nappa leather & RFID shield.',
        description: 'Ultra-compact everyday luxury. Engineered from genuine aerospace 3K carbon fiber woven weave combined with velvety soft full-grain nappa leather. Features 8 card slots, dual currency compartments, and full military-grade RFID protection.',
        features: [
          'Real 3K matte weave carbon fiber exterior',
          'Ultra-thin 9mm silhouette that prevents pocket bulge',
          'Integrated aerospace aluminum RFID shielding',
          '8 dedicated card slots + 2 hidden slip pockets'
        ],
        colors: ['Matte Stealth Carbon', 'Forged Marble Carbon'],
        createdAt: '2026-03-08T12:00:00Z',
        reviews: [
          {
            id: 'rev_18',
            userName: 'Rohan Mehra',
            rating: 5,
            date: '2026-03-13',
            comment: 'Remarkably slim yet fits 10 cards easily. The carbon fiber feels indestructible.'
          }
        ]
      },
      {
        id: 'prod_18',
        title: 'Tuscan Suede Handcrafted Chelsea Boots',
        category: 'Fashion',
        price: 21500.00,
        originalPrice: 25000.00,
        rating: 4.9,
        reviewsCount: 57,
        inStock: true,
        stockQuantity: 16,
        featured: false,
        badge: 'Artisanal',
        image: 'https://images.unsplash.com/photo-1638247025967-b4e38f787b76?auto=format&fit=crop&w=800&q=80',
        gallery: [
          'https://images.unsplash.com/photo-1638247025967-b4e38f787b76?auto=format&fit=crop&w=800&q=80'
        ],
        shortDescription: 'Weatherproofed Italian calf suede boots with Blake-stitched leather and rubber soles.',
        description: 'Handmade in Florence using time-honored Blake welting. Cut from premium water-repellent calf suede, lined with glove-soft leather, and equipped with durable rubber-injected leather soles for dependable grip.',
        features: [
          'Italian water-resistant oiled calf suede',
          'Resoleable Blake-stitch sole construction',
          'Elasticized side gussets for effortless pull-on comfort',
          'Reinforced grosgrain heel pull tabs'
        ],
        colors: ['Chocolate Suede', 'Tobacco Tan Suede', 'Charcoal Black'],
        sizes: ['US 8', 'US 9', 'US 10', 'US 11', 'US 12'],
        createdAt: '2026-03-09T12:00:00Z',
        reviews: [
          {
            id: 'rev_19',
            userName: 'Kabir Oberoi',
            rating: 5,
            date: '2026-03-15',
            comment: 'Fits true to size. The suede has rich texture and the silhouette is sleek.'
          }
        ]
      }
    ],
    orders: [
      {
        id: 'ord_1001',
        userId: 'usr_demo_1',
        customerName: 'Sophia Vance',
        customerEmail: 'demo@nikkaura.com',
        shippingAddress: {
          fullName: 'Sophia Vance',
          street: '42 Marine Drive',
          city: 'Mumbai',
          state: 'Maharashtra',
          postalCode: '400020',
          country: 'India',
          phone: '+91 98200 12345'
        },
        items: [
          {
            productId: 'prod_1',
            title: 'NIKK AURA Studio Wireless ANC Headphones',
            image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
            price: 24999.00,
            quantity: 1,
            selectedColor: 'Matte Obsidian'
          },
          {
            productId: 'prod_8',
            title: 'NIKK AURA Pure Ultrasonic Stone Diffuser',
            image: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=800&q=80',
            price: 9490.00,
            quantity: 1,
            selectedColor: 'Porecelain Sand'
          }
        ],
        subtotal: 34489.00,
        discountAmount: 3448.90,
        appliedCoupon: 'WELCOME10',
        shippingFee: 0.00,
        taxAmount: 1552.00,
        totalAmount: 32592.10,
        status: 'shipped',
        paymentMethod: 'UPI / Credit Card',
        trackingNumber: 'NIKK-9842104-EXP',
        estimatedDelivery: '2026-11-28',
        createdAt: '2026-11-01T14:32:00Z'
      }
    ]
  };
};

// Database store manager with dual-mode (MongoDB Atlas + Atomic File Fallback)
class DataStore {
  constructor() {
    this.filePath = config.DB_FILE;
    this.data = null;
    this.isMongoConnected = false;
    this.mongoError = null;
    this.init();
    if (config.MONGODB_URI) {
      this.initMongo(config.MONGODB_URI);
    }
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
      console.error('Error loading file database, creating fresh seeds:', err);
      this.data = getInitialSeeds();
      this.persist();
    }
  }

  async initMongo(uri) {
    try {
      console.log('Connecting to MongoDB Atlas...');
      await mongoose.connect(uri);
      this.isMongoConnected = true;
      this.mongoError = null;
      console.log('✅ Connected to MongoDB Atlas successfully!');

      // Auto-seed MongoDB Atlas if empty
      const productCount = await Product.countDocuments();
      if (productCount === 0) {
        console.log('🌱 Seeding MongoDB Atlas with initial catalog...');
        const seeds = getInitialSeeds();

        // Seed users
        for (const u of seeds.users) {
          await User.findOneAndUpdate(
            { email: u.email },
            { name: u.name, email: u.email, password: u.password, role: u.role, createdAt: u.createdAt },
            { upsert: true }
          );
        }

        // Seed products
        for (const p of seeds.products) {
          const { id, ...pData } = p;
          await Product.create(pData);
        }

        // Seed coupons
        for (const c of seeds.coupons) {
          await Coupon.findOneAndUpdate({ code: c.code }, c, { upsert: true });
        }

        // Seed orders
        for (const o of seeds.orders) {
          const { id, ...oData } = o;
          await Order.create(oData);
        }

        console.log('✅ MongoDB Atlas seeded successfully!');
      }

      // Sync in-memory cache from MongoDB
      await this.syncFromMongo();
    } catch (err) {
      console.error('⚠️ MongoDB Atlas connection error, continuing with local storage:', err.message);
      this.isMongoConnected = false;
      this.mongoError = err.message;
    }
  }

  async syncFromMongo() {
    if (!this.isMongoConnected) return;
    try {
      const [users, products, orders, coupons] = await Promise.all([
        User.find().lean(),
        Product.find().lean(),
        Order.find().lean(),
        Coupon.find().lean()
      ]);

      this.data = {
        users: users.map(u => ({ id: u._id.toString(), ...u })),
        products: products.map(p => ({ id: p._id.toString(), ...p })),
        orders: orders.map(o => ({ id: o._id.toString(), ...o })),
        coupons: coupons.map(c => ({ id: c._id.toString(), ...c }))
      };
      this.persist();
    } catch (e) {
      console.error('Failed to sync from MongoDB:', e.message);
    }
  }

  persist() {
    try {
      const tempPath = `${this.filePath}.tmp`;
      fs.writeFileSync(tempPath, JSON.stringify(this.data, null, 2), 'utf8');
      fs.renameSync(tempPath, this.filePath);
    } catch (err) {
      console.error('Failed to persist local cache:', err);
    }
  }

  // --- Users ---
  getUsers() {
    return this.data.users || [];
  }

  async findUserByEmail(email) {
    if (!email) return null;
    const lower = email.trim().toLowerCase();
    
    // Check in-memory / local cache first
    const cached = this.getUsers().find(u => u.email && u.email.toLowerCase() === lower);
    if (cached) return cached;

    // Check MongoDB Atlas directly
    if (this.isMongoConnected) {
      try {
        const u = await User.findOne({ email: lower }).lean();
        if (u) {
          const formatted = { id: u._id.toString(), ...u };
          this.data.users.push(formatted);
          return formatted;
        }
      } catch (err) {
        console.error('MongoDB findUserByEmail error:', err.message);
      }
    }

    return null;
  }

  async findUserById(id) {
    const cached = this.getUsers().find(u => u.id === id);
    if (cached) return cached;

    if (this.isMongoConnected && mongoose.Types.ObjectId.isValid(id)) {
      try {
        const u = await User.findById(id).lean();
        if (u) return { id: u._id.toString(), ...u };
      } catch (e) {}
    }
    return null;
  }

  async createUser(userData) {
    const newUser = {
      id: `usr_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      role: 'customer',
      createdAt: new Date().toISOString(),
      ...userData
    };

    // Save directly to MongoDB Atlas
    if (this.isMongoConnected) {
      try {
        const doc = await User.create({
          name: userData.name,
          email: userData.email,
          password: userData.password,
          role: userData.role || 'customer'
        });
        newUser.id = doc._id.toString();
      } catch (err) {
        console.error('MongoDB User create error:', err.message);
      }
    }

    this.data.users.push(newUser);
    this.persist();
    return newUser;
  }

  // --- Products ---
  getProducts() {
    return this.data.products || [];
  }

  findProductById(id) {
    return this.getProducts().find(p => p.id === id || (p._id && p._id.toString() === id));
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

    // Async write to MongoDB Atlas
    if (this.isMongoConnected) {
      Product.create(productData)
        .then(doc => { newProduct.id = doc._id.toString(); })
        .catch(err => console.error('MongoDB Product create error:', err.message));
    }

    return newProduct;
  }

  updateProduct(id, updates) {
    const index = this.data.products.findIndex(p => p.id === id || (p._id && p._id.toString() === id));
    if (index === -1) return null;
    this.data.products[index] = { ...this.data.products[index], ...updates };
    this.persist();

    // Async write to MongoDB Atlas
    if (this.isMongoConnected) {
      if (mongoose.Types.ObjectId.isValid(id)) {
        Product.findByIdAndUpdate(id, updates).catch(e => console.error('MongoDB Product update error:', e.message));
      } else {
        Product.findOneAndUpdate({ title: this.data.products[index].title }, updates).catch(e => console.error('MongoDB Product update error:', e.message));
      }
    }

    return this.data.products[index];
  }

  deleteProduct(id) {
    const index = this.data.products.findIndex(p => p.id === id || (p._id && p._id.toString() === id));
    if (index === -1) return false;
    const removed = this.data.products.splice(index, 1)[0];
    this.persist();

    // Async write to MongoDB Atlas
    if (this.isMongoConnected) {
      if (mongoose.Types.ObjectId.isValid(id)) {
        Product.findByIdAndDelete(id).catch(e => console.error('MongoDB Product delete error:', e.message));
      } else {
        Product.findOneAndDelete({ title: removed.title }).catch(e => console.error('MongoDB Product delete error:', e.message));
      }
    }

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

    // Async write to MongoDB Atlas
    if (this.isMongoConnected) {
      if (mongoose.Types.ObjectId.isValid(productId)) {
        Product.findByIdAndUpdate(productId, {
          rating: product.rating,
          reviewsCount: product.reviewsCount,
          $push: { reviews: reviewData }
        }).catch(e => console.error('MongoDB addReview error:', e.message));
      }
    }

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
    return this.getOrders().find(o => o.id === id || (o._id && o._id.toString() === id));
  }

  findOrdersByUserId(userId) {
    return this.getOrders().filter(o => o.userId === userId);
  }

  createOrder(orderData) {
    const newOrder = {
      id: `ord_${Date.now()}`,
      status: 'processing',
      trackingNumber: `NIKK-${Math.floor(1000000 + Math.random() * 9000000)}-EXP`,
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

    // Async write to MongoDB Atlas
    if (this.isMongoConnected) {
      Order.create(orderData).catch(err => console.error('MongoDB Order create error:', err.message));
    }

    return newOrder;
  }

  updateOrderStatus(orderId, status) {
    const order = this.findOrderById(orderId);
    if (!order) return null;
    order.status = status;
    this.persist();

    // Async write to MongoDB Atlas
    if (this.isMongoConnected) {
      if (mongoose.Types.ObjectId.isValid(orderId)) {
        Order.findByIdAndUpdate(orderId, { status }).catch(e => console.error('MongoDB order status update error:', e.message));
      }
    }

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
