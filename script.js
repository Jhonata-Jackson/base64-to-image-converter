document.getElementById('convertButton').addEventListener('click', function () {
  const base64String = document.getElementById('base64Input').value.trim();

  if (!base64String) {
    alert('Por favor, cole um código Base64!');
    return;
  }

  const finalBase64 = base64String.startsWith('data:image')
    ? base64String
    : `data:image/jpeg;base64,${base64String}`;

  const img = new Image();
  img.src = finalBase64;

  const container = document.getElementById('imageContainer');
  container.innerHTML = '';
  container.appendChild(img);

  const downloadButton = document.getElementById('downloadButton');
  downloadButton.style.display = 'inline-block';

  downloadButton.onclick = function () {
    const a = document.createElement('a');
    a.href = finalBase64;
    a.download = 'imagem_convertida.jpg';
    a.click();
  };

  img.onload = () => {
    fetch(finalBase64)
      .then(res => res.blob())
      .then(blob => {
        const reader = new FileReader();
        reader.onload = function (e) {
          const exifData = EXIF.readFromBinaryFile(e.target.result);
          displayExifData(exifData);
        };
        reader.readAsArrayBuffer(blob);
      });
  };
});

function displayExifData(data) {
  const infoContainer = document.getElementById('imageInfo');
  infoContainer.innerHTML = '<h3>Informações da Imagem (EXIF):</h3>';

  if (!data || Object.keys(data).length === 0) {
    infoContainer.innerHTML += '<p>Nenhum dado EXIF encontrado.</p>';
    return;
  }

  const ul = document.createElement('ul');
  for (let key in data) {
    const li = document.createElement('li');
    li.textContent = `${key}: ${data[key]}`;
    ul.appendChild(li);
  }

  infoContainer.appendChild(ul);
}