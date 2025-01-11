let myChart = null;


// Fungsi -----------------------------------------------------------------
// Sync -------------------------------------------------------------------



// Simpan data ke local storage
function saveToLocalStorage(title, maxValue, data) {
    const chartData = {
        title: title,
        maxValue: maxValue,
        data: data
    };
    localStorage.setItem('chartData', JSON.stringify(chartData));
}



// Ambil data dari local storage
function loadFromLocalStorage() {
    const storedData = localStorage.getItem('chartData');
    if (storedData) {
        const chartData = JSON.parse(storedData);
        createChart(chartData.data, chartData.title, chartData.maxValue);
    }
}



// Hapus Semua Data
function clearData() {
    localStorage.removeItem('chartData');
    if (myChart) {
        myChart.destroy();
        myChart = null;
    }
    // Bersihkan canvas
    const canvas = document.getElementById('Progrise');
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}



// Mengganti Judul
function changeTitle() {
    Swal.fire({
        title: 'Ganti Judul Diagram',
        input: 'text',
        inputLabel: 'Masukkan judul baru',
        inputPlaceholder: 'Judul baru',
        preConfirm: (newTitle) => {
            if (!newTitle) {
                Swal.showValidationMessage('Judul tidak boleh kosong');
                return false;
            }
            const storedData = JSON.parse(localStorage.getItem('chartData'));
            storedData.title = newTitle;
            localStorage.setItem('chartData', JSON.stringify(storedData));
            createChart(storedData.data, newTitle, storedData.maxValue);
            Swal.fire('Sukses', 'Judul telah diganti', 'success');
        }
    });
}



// Menambahkan Data
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
        focusConfirm: false,
        preConfirm: () => {
            const newName = document.getElementById('newName').value;
            const newValue = parseFloat(document.getElementById('newValue').value);
            if (!newName || isNaN(newValue)) {
                Swal.showValidationMessage('Semua field harus diisi');
                return false;
            }
            if (newValue > storedData.maxValue) {
                Swal.showValidationMessage('Nilai tidak boleh melebihi batas maksimum');
                return false;
            }
            storedData.data.push({ name: newName, value: newValue });
            localStorage.setItem('chartData', JSON.stringify(storedData));
            createChart(storedData.data, storedData.title, storedData.maxValue);
            Swal.fire('Sukses', 'Data telah ditambahkan', 'success');
        }
    });
}



// Mengedit Data
function EditData() {
    const storedData = JSON.parse(localStorage.getItem('chartData'));
    if (!storedData) {
        Swal.fire('Error', 'Tidak ada data untuk diubah', 'error');
        return;
    }

    let optionsHTML = '';
    storedData.data.forEach((item, index) => {
        optionsHTML += `<option value="${index}">${item.name} - ${item.value}</option>`;
    });

    Swal.fire({
        title: 'Pilih Data untuk Diedit',
        html: `
    <select id="dataToEdit" class="swal2-input">${optionsHTML}</select>
    <input id="editValue" type="number" class="swal2-input" placeholder="Nilai baru" min="0" step="0.01">
`,
        preConfirm: () => {
            const index = document.getElementById('dataToEdit').value;
            const newValue = parseFloat(document.getElementById('editValue').value);
            if (isNaN(newValue) || newValue > storedData.maxValue) {
                Swal.showValidationMessage('Nilai tidak valid');
                return false;
            }
            storedData.data[index].value = newValue;
            localStorage.setItem('chartData', JSON.stringify(storedData));
            createChart(storedData.data, storedData.title, storedData.maxValue);
            Swal.fire('Sukses', 'Data telah diedit', 'success');
        }
    });
}



// Menghapus Data
function deleteData() {
    const storedData = JSON.parse(localStorage.getItem('chartData'));
    if (!storedData) {
        Swal.fire('Error', 'Tidak ada data untuk dihapus', 'error');
        return;
    }

    let optionsHTML = '';
    storedData.data.forEach((item, index) => {
        optionsHTML += `<option value="${index}">${item.name} - ${item.value}</option>`;
    });

    Swal.fire({
        title: 'Pilih Data untuk Dihapus',
        html: `<select id="dataToDelete" class="swal2-input">${optionsHTML}</select>`,
        preConfirm: () => {
            const index = document.getElementById('dataToDelete').value;
            storedData.data.splice(index, 1);
            localStorage.setItem('chartData', JSON.stringify(storedData));
            createChart(storedData.data, storedData.title, storedData.maxValue);
            Swal.fire('Sukses', 'Data telah dihapus', 'success');
        }
    });
}



// Membuat chart
function createChart(data, title, maxValue) {
    if (myChart) {
        myChart.destroy();
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
                            return value.toFixed(2);
                        }
                    }
                }
            },
            plugins: {
                legend: {
                    display: true,
                    position: 'top',
                },
                tooltip: {
                    enabled: true,
                    callbacks: {
                        label: function (context) {
                            let label = context.dataset.label || '';
                            if (label) {
                                label += ': ';
                            }
                            label += context.parsed.y.toFixed(2);
                            return label;
                        }
                    }
                }
            }
        }
    });
}




// Fungsi -----------------------------------------------------------------
// Async ------------------------------------------------------------------



// Input judul dan jumlah data
async function createDiagram() {
    const { value: formValues } = await Swal.fire({
        title: 'Input Data Diagram',
        html: `
            <div style="margin-bottom: 1rem;">
                <label for="swal-input1" class="swal2-label">Judul Diagram:</label>
                <input id="swal-input1" class="swal2-input" placeholder="(String)">
            </div>
            <div>
                <label for="swal-input2" class="swal2-label">Jumlah Data:</label>
                <input id="swal-input2" type="number" class="swal2-input" placeholder="(Integer)" min="1" max="100" step="1">
            </div>
        `,
        focusConfirm: false,
        preConfirm: () => {
            const title = document.getElementById('swal-input1').value;
            const count = document.getElementById('swal-input2').value;
            if (!title || !count) {
                Swal.showValidationMessage('Semua field harus diisi');
                return false;
            }
            if (count < 1 || count > 100) {
                Swal.showValidationMessage('Jumlah data harus antara 1-100');
                return false;
            }
            return [title, count];
        }
    });


    if (!formValues) return;
    const [chartTitle, objCount] = formValues;


    // Input batas maksimum nilai
    const { value: maxValue } = await Swal.fire({
        title: 'Batas Maksimum Nilai',
        input: 'number',
        inputLabel: 'Masukkan batas maksimum nilai',
        inputPlaceholder: 'Contoh: 100 (Float)',
        inputAttributes: {
            min: '0.01',
            step: '0.01'
        },
        validationMessage: 'Nilai harus lebih dari 0'
    });


    if (!maxValue) return;


    // Membuat form HTML untuk semua data sekaligus
    let inputHTML = '';
    for (let i = 0; i < objCount; i++) {
        inputHTML += `
            <div class="input-pair">
                <input id="name${i}" class="swal2-input" placeholder="Nama ${i + 1} (String)">
                <input id="value${i}" type="number" class="swal2-input" placeholder="Nilai ${i + 1} (Float)" 
                    min="0" max="${maxValue}" step="0.01">
            </div>
        `;
    }


    // Input semua data sekaligus
    const { value: dataValues } = await Swal.fire({
        title: 'Input Data',
        html: `
            <div style="margin-bottom: 1rem;">
                <div class="input-pair">
                    <label class="swal2-label" style="width: calc(50% - 5px)">Nama</label>
                    <label class="swal2-label" style="width: calc(50% - 5px)">Nilai</label>
                </div>
                ${inputHTML}
            </div>
        `,
        focusConfirm: false,
        preConfirm: () => {
            const data = [];
            for (let i = 0; i < objCount; i++) {
                const name = document.getElementById(`name${i}`).value;
                const value = document.getElementById(`value${i}`).value;

                if (!name || !value) {
                    Swal.showValidationMessage('Semua field harus diisi');
                    return false;
                }
                if (parseFloat(value) < 0 || parseFloat(value) > maxValue) {
                    Swal.showValidationMessage(`Nilai harus antara 0 dan ${maxValue}`);
                    return false;
                }
                data.push({ name, value: parseFloat(value) });
            }
            return data;
        }
    });


    if (!dataValues) return;


    // Simpan data di localStorage
    saveToLocalStorage(chartTitle, parseFloat(maxValue), dataValues);


    // Membuat atau memperbarui grafik
    createChart(dataValues, chartTitle, parseFloat(maxValue));
}




// Tampilkan semua data 
async function showData() {
    const storedData = localStorage.getItem('chartData');
    if (storedData) {
        const chartData = JSON.parse(storedData);


        // Membuat tabel HTML untuk data
        let tableHTML = `
            <div style="margin-bottom: 20px; text-align: left">
                <strong>Judul Diagram:</strong> ${chartData.title}<br>
                <strong>Batas Maksimum:</strong> ${chartData.maxValue}
            </div>
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px">
                <tr style="background-color: #f3f3f3">
                    <th style="padding: 8px; border: 1px solid #ddd; text-align: left">No</th>
                    <th style="padding: 8px; border: 1px solid #ddd; text-align: left">Nama</th>
                    <th style="padding: 8px; border: 1px solid #ddd; text-align: left">Nilai</th>
                </tr>
        `;


        chartData.data.forEach((item, index) => {
            tableHTML += `
                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd">${index + 1}</td>
                    <td style="padding: 8px; border: 1px solid #ddd">${item.name}</td>
                    <td style="padding: 8px; border: 1px solid #ddd">${item.value.toFixed(2)}</td>
                </tr>
            `;
        });


        tableHTML += '</table>';

        
        await Swal.fire({
            title: 'Data Diagram',
            html: tableHTML,
            width: '600px',
            confirmButtonText: 'Tutup',
            confirmButtonColor: '#355E3B'
        });
    } else {
        await Swal.fire({
            icon: 'info',
            title: 'Tidak Ada Data',
            text: 'Belum ada data diagram yang tersimpan',
            confirmButtonColor: '#355E3B'
        });
    }
}




// Tombol hapus semua data
async function clearData() {
    const result = await Swal.fire({
        title: 'Konfirmasi',
        text: 'Apakah Anda yakin ingin menghapus semua data diagram?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#355E3B',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Ya, Hapus!',
        cancelButtonText: 'Batal'
    });


    if (result.isConfirmed) {
        // Hapus data dari localStorage
        localStorage.removeItem('chartData');

        // Hapus chart yang sedang ditampilkan
        if (myChart) {
            myChart.destroy();
            myChart = null;
        }


        // Bersihkan canvas
        const canvas = document.getElementById('Progrise');
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);


        // Tampilkan pesan sukses
        await Swal.fire({
            title: 'Terhapus!',
            text: 'Data diagram telah dihapus.',
            icon: 'success',
            confirmButtonColor: '#355E3B'
        });
    }
}




// Saat halaman dimuat, coba ambil data dari localStorage
window.onload = loadFromLocalStorage;
