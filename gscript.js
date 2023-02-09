function sendRequest() {
  var url = "https://example.com/data.json"; // URL tujuan
  var method = "GET"; // Metode permintaan (GET atau POST)

  var headers = {
    "Content-Type": "application/json" // Tipe konten dari permintaan
  };

  var payload = {}; // Data yang akan dikirim dalam permintaan (hanya digunakan jika metode adalah POST)

  var options = {
    "method": method,
    "headers": headers,
    "payload": payload
  };

  var response = UrlFetchApp.fetch(url, options); // Kirim permintaan

  var data = JSON.parse(response.getContentText()); // Tampung respons dan parse sebagai JSON

  // Gunakan data di sini
}
