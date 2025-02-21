# Chart Generator

**Chart Generator** adalah aplikasi web interaktif yang memungkinkan pengguna untuk membuat, mengelola, dan memvisualisasikan data dalam bentuk diagram batang (bar chart) menggunakan **Chart.js**. Aplikasi ini dilengkapi dengan fitur-fitur seperti menambahkan, mengedit, menghapus data, serta menyimpan dan memuat data dari **localStorage**. Dengan antarmuka yang ramah pengguna dan pop-up interaktif menggunakan **SweetAlert2**, aplikasi ini cocok untuk siapa saja yang ingin memvisualisasikan data secara cepat dan mudah.

---

## Fitur Utama

- **Membuat Diagram Baru**: Buat diagram dengan judul, jumlah data, dan batas maksimum nilai.
- **Menyimpan dan Memuat Data**: Data disimpan di `localStorage` dan dapat dimuat kembali saat halaman dimuat ulang.
- **Menambahkan Data**: Tambahkan data baru ke diagram yang sudah ada.
- **Mengedit Data**: Edit nilai data yang sudah ada.
- **Menghapus Data**: Hapus data tertentu atau hapus semua data sekaligus.
- **Mengubah Judul Diagram**: Ubah judul diagram sesuai kebutuhan.
- **Visualisasi Data**: Tampilkan data dalam bentuk tabel dan diagram batang yang responsif.

---

## Teknologi yang Digunakan

- **Chart.js**: Library JavaScript untuk membuat diagram dan grafik.
- **SweetAlert2**: Library JavaScript untuk menampilkan pop-up interaktif.
- **HTML5 & CSS3**: Untuk struktur dan tampilan antarmuka pengguna.
- **JavaScript (ES6+)**: Untuk logika dan fungsionalitas aplikasi.

---

## Struktur Kode Unggulan

Berikut adalah beberapa potongan kode unggulan yang menggambarkan fungsionalitas utama aplikasi:

### 1. **Menyimpan dan Memuat Data dari localStorage**

```javascript
// Simpan data ke localStorage
function saveToLocalStorage(title, maxValue, data) {
    const chartData = {
        title: title,
        maxValue: maxValue,
        data: data
    };
    localStorage.setItem('chartData', JSON.stringify(chartData));
}

// Muat data dari localStorage
function loadFromLocalStorage() {
    const storedData = localStorage.getItem('chartData');
    if (storedData) {
        const chartData = JSON.parse(storedData);
        createChart(chartData.data, chartData.title, chartData.maxValue);
    }
}
```

### 2. **Membuat Diagram dengan Chart.js**

```javascript
function createChart(data, title, maxValue) {
    if (myChart) {
        myChart.destroy(); // Hapus chart lama jika ada
    }

    const ctx = document.getElementById('Progrise').getContext('2d');
    myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: data.map(item => item.name),
            datasets: [{
                label: title,
                data: data.map(item => item.value),
                backgroundColor: '#355E3B',
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    max: maxValue,
                    ticks: {
                        callback: function (value) {
                            return value.toFixed(2); // Format nilai dengan 2 desimal
                        }
                    }
                }
            }
        }
    });
}
```

### 3. **Menambahkan Data Baru**

```javascript
function addData() {
    const storedData = JSON.parse(localStorage.getItem('chartData'));
    if (!storedData) {
        Swal.fire('Error', 'Tidak ada diagram untuk ditambahkan data', 'error');
        return;
    }

    Swal.fire({
        title: 'Tambah Data',
        html: `
            <input id="newName" class="swal2-input" placeholder="Nama baru">
            <input id="newValue" type="number" class="swal2-input" placeholder="Nilai baru" min="0" step="0.01">
        `,
        preConfirm: () => {
            const newName = document.getElementById('newName').value;
            const newValue = parseFloat(document.getElementById('newValue').value);
            if (!newName || isNaN(newValue)) {
                Swal.showValidationMessage('Semua field harus diisi');
                return false;
            }
            if (newValue > storedData.maxValue) {
                Swal.showValidationMessage('Nilai tidak boleh melebihi batas maksimum ');
                return false;
            }
            storedData.data.push({ name: newName, value: newValue });
            localStorage.setItem('chartData', JSON.stringify(storedData));
            createChart(storedData.data, storedData.title, storedData.maxValue);
            Swal.fire('Sukses', 'Data telah ditambahkan', 'success');
        }
    });
}
```

---

## Cara Menggunakan Aplikasi

1. **Membuat Diagram Baru**:
   - Klik tombol "Create Diagram".
   - Masukkan judul diagram, jumlah data, dan batas maksimum nilai.
   - Masukkan nama dan nilai untuk setiap data.

2. **Menampilkan Data**:
   - Klik tombol "Show Data" untuk melihat semua data yang digunakan dalam diagram.

3. **Menghapus Semua Data**:
   - Klik tombol "Clear Data" untuk menghapus semua data yang ada dalam diagram.

4. **Mengubah Judul Diagram**:
   - Klik tombol "Change Title" untuk mengubah judul diagram.

5. **Menambahkan Data Baru**:
   - Klik tombol "Add Data" untuk menambahkan data baru ke dalam diagram.

6. **Mengedit Data**:
   - Klik tombol "Edit Data" untuk mengedit data yang sudah ada dalam diagram.

7. **Menghapus Data Secara Selektif**:
   - Klik tombol "Delete Data" untuk menghapus data tertentu dari diagram.

---

## Cara Menjalankan Aplikasi

1. Clone repositori ini ke komputer Anda.
2. Buka file `index.html` di browser Anda.
3. Mulai menggunakan aplikasi Diagram Generator.

---

## Kontribusi

Jika Anda ingin berkontribusi pada proyek ini, silakan buka issue atau pull request di repositori GitHub.



