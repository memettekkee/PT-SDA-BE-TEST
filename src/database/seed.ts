// prisma/seed.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const categories = [
    { name: 'Pakaian', type: 'Baju' },
    { name: 'Pakaian', type: 'Celana' },
    { name: 'Pakaian', type: 'Jaket' },
    { name: 'Pakaian', type: 'Kemeja' },
    { name: 'Pakaian', type: 'Kaos' },
    { name: 'Pakaian', type: 'Dress' },
    { name: 'Pakaian', type: 'Rok' },
    { name: 'Pakaian', type: 'Sweater' },
    { name: 'Pakaian', type: 'Hoodie' },
    { name: 'Pakaian', type: 'Jas' },
    { name: 'Elektronik', type: 'Gadget' },
    { name: 'Elektronik', type: 'Laptop' },
    { name: 'Elektronik', type: 'Komputer' },
    { name: 'Elektronik', type: 'TV' },
    { name: 'Elektronik', type: 'Speaker' },
    { name: 'Elektronik', type: 'Headphone' },
    { name: 'Elektronik', type: 'Kamera' },
    { name: 'Elektronik', type: 'Drone' },
    { name: 'Olahraga', type: 'Sepak Bola' },
    { name: 'Olahraga', type: 'Basket' },
    { name: 'Olahraga', type: 'Tenis' },
    { name: 'Olahraga', type: 'Renang' },
    { name: 'Olahraga', type: 'Yoga' },
    { name: 'Olahraga', type: 'Bulu Tangkis' },
    { name: 'Otomotif', type: 'Mobil' },
    { name: 'Otomotif', type: 'Motor' },
    { name: 'Otomotif', type: 'Sepeda' }
  ];

  for (const category of categories) {
    await prisma.category.create({
      data: {
        name: category.name,
        type: category.type
      }
    });
  }

  const colours = [
    { name: 'Merah', hex: '#FF0000' },
    { name: 'Biru', hex: '#0000FF' },
    { name: 'Hitam', hex: '#000000' },
    { name: 'Putih', hex: '#FFFFFF' },
    { name: 'Hijau', hex: '#00FF00' },
    { name: 'Kuning', hex: '#FFFF00' },
    { name: 'Ungu', hex: '#800080' },
    { name: 'Oranye', hex: '#FFA500' },
    { name: 'Merah Muda', hex: '#FFC0CB' },
    { name: 'Coklat', hex: '#A52A2A' },
    { name: 'Abu-abu', hex: '#808080' },
    { name: 'Cyan', hex: '#00FFFF' },
    { name: 'Magenta', hex: '#FF00FF' },
    { name: 'Emas', hex: '#FFD700' },
    { name: 'Perak', hex: '#C0C0C0' },
    { name: 'Marun', hex: '#800000' },
    { name: 'Navy', hex: '#000080' },
    { name: 'Hijau Tua', hex: '#006400' },
    { name: 'Turquoise', hex: '#40E0D0' },
    { name: 'Lavender', hex: '#E6E6FA' }
  ];

  for (const colour of colours) {
    await prisma.colour.create({
      data: {
        name: colour.name,
        hex: colour.hex
      }
    });
  }

  const sizes = [
    { name: 'S', length: 60, height: 40, width: 30 },
    { name: 'M', length: 65, height: 45, width: 35 },
    { name: 'L', length: 70, height: 50, width: 40 },
    { name: 'XL', length: 75, height: 55, width: 45 }
  ];

  for (const size of sizes) {
    await prisma.size.create({
      data: {
        name: size.name,
        length: size.length,
        height: size.height,
        width: size.width
      }
    });
  }

  console.log('Seed data created successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });