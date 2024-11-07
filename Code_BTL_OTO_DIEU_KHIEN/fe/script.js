function sendCommand(command) {
  console.log(command);
}

function sendCommandToBackend(command) {
  fetch('http://127.0.0.1:5000/controll', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ speech: command }),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log('Phản hồi từ API:', data);
      document.getElementById(
        'status',
      ).textContent = `Đã gửi lệnh: ${data.speech}`;
    })
    .catch((error) => {
      console.error('Lỗi khi gửi dữ liệu:', error);
      document.getElementById('status').textContent =
        'Có lỗi xảy ra khi gửi lệnh.';
    });
}

function recordVoice() {
  const recordButton = document.querySelector('.record-btn');
  const statusElement = document.getElementById('status');
  statusElement.textContent = 'Đang thu âm...';
  recordButton.classList.add('recording');

  // Thêm spinner
  const spinner = document.createElement('div');
  spinner.classList.add('spinner');
  recordButton.appendChild(spinner);

  if (!('webkitSpeechRecognition' in window)) {
    console.log('Trình duyệt không hỗ trợ Web Speech API');
    statusElement.textContent = 'Trình duyệt không hỗ trợ Web Speech API';

    // Xóa hiệu ứng khi gặp lỗi
    recordButton.classList.remove('recording');
    if (spinner) recordButton.removeChild(spinner);
  } else {
    const recognition = new webkitSpeechRecognition();
    recognition.lang = 'vi-VN'; // Đặt ngôn ngữ là tiếng Việt
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    // Khi bắt đầu thu âm
    recognition.onstart = function () {
      console.log('Đang thu âm...');
    };

    // Khi nhận diện giọng nói thành công
    recognition.onresult = function (event) {
      const transcript = event.results[0][0].transcript;
      console.log('Đã nhận diện giọng nói: ' + transcript);
      statusElement.textContent = 'Đã thu âm: ' + transcript;

      // Xóa hiệu ứng sau khi hoàn thành thu âm
      recordButton.classList.remove('recording');
      if (spinner) recordButton.removeChild(spinner);
      sendCommandToBackend(transcript);
    };

    // Khi gặp lỗi trong quá trình thu âm
    recognition.onerror = function (event) {
      console.error('Lỗi thu âm: ' + event.error);
      statusElement.textContent = 'Lỗi thu âm: ' + event.error;

      // Xóa hiệu ứng khi gặp lỗi
      recordButton.classList.remove('recording');
      if (spinner) recordButton.removeChild(spinner);
    };

    // Bắt đầu quá trình thu âm
    recognition.start();
  }
}

// const ctx = document.getElementById('distanceChart').getContext('2d');
// const distanceChart = new Chart(ctx, {
//   type: 'line',
//   data: {
//     datasets: [
//       {
//         label: 'My Time Series Data',
//         data: [],
//         borderColor: 'blue',
//       },
//     ],
//   },
//   options: {
//     scales: {
//       x: {
//         type: 'realtime',
//         realtime: {
//           delay: 1000,
//           refresh: 1000,
//           onRefresh: (chart) => {
//             fetch_think_speak_data().then((data) => {
//               chart.data.datasets.forEach((dataset) => {
//                 dataset.data.push({
//                   x: Date.now(),
//                   y: data,
//                 });
//               });

//               const cutoff = Date.now() - 3 * 60 * 1000; // 3 minutes
//               chart.data.datasets.forEach((dataset) => {
//                 dataset.data = dataset.data.filter((data) => data.x > cutoff);
//               });

//               chart.update();
//             });
//           },
//         },
//       },
//     },
//   },
// });
