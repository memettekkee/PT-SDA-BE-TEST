# PT-SDA-BE-TEST
Asesmen test dari PT Sellerpintar Digital Asia 
Sebagai Back-End Developer

**Project Setup Instructions**

---

### Requirements
- Node.js
- Express.js
- Typescript
- Prisma
- PostgreSQL (Database)

---

### .env Configuration
Buat file `.env` di root project dan isi dengan format berikut:

```env
DATABASE_URL=your_database_connection_string
IMAGE_PATH=path/to/your/project/folder (isi dengan path yang merujuk ke folder project Anda, contohnya: /Users/username/myproject)
JWT_SECRET=your_secret_token
```

Penjelasan:
- `DATABASE_URL`: Koneksi ke database yang digunakan project.
- `IMAGE_PATH`: Path lokal ke folder project Anda, digunakan untuk mengatur lokasi file gambar yang dikelola oleh aplikasi.
- `JWT_SECRET`: Secret key untuk proses enkripsi JWT (authentication).

---

### Installation and Running Steps

1. **Install dependencies**
```bash
npm install
```

2. **Generate Prisma Client**
```bash
npm run prisma:generate
```

3. **Migrate Database**
```bash
npm run prisma:migrate
```

4. **Seed Database**
```bash
npm run seed
```

5. **Start the Application**
```bash
npm run start
```

---

### Additional Commands Explanation

- `npm run dev`
  > Menjalankan aplikasi dalam mode development menggunakan `nodemon`, yang otomatis reload saat ada perubahan file `.ts`.

- `npm run start`
  > Menjalankan aplikasi secara normal menggunakan `ts-node`, tanpa auto-reload.

- `npm run build`
  > Compile semua file TypeScript di project ke JavaScript menggunakan `tsc`.

- `npm run prisma:generate`
  > Membuat Prisma Client berdasarkan skema yang ada di `prisma/schema.prisma`.

- `npm run prisma:migrate`
  > Menjalankan migrasi database berdasarkan perubahan di skema Prisma.

- `npm run prisma:studio`
  > Membuka Prisma Studio, GUI untuk melihat dan mengedit data di database.

- `npm run seed`
  > Menjalankan script seeding untuk mengisi database dengan data awal.

---

**Catatan:**
Untuk development, Anda disarankan menggunakan `npm run dev` supaya perubahan otomatis terdeteksi dan tidak perlu restart manual.

---

Happy coding! ✨

### Rancangan Database
![SDA-ECommerce-db-design drawio](https://github.com/user-attachments/assets/5532646b-0a21-411d-b117-ecb0c9c23aa5)


