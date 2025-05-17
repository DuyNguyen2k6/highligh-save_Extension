document.addEventListener('DOMContentLoaded', () => {
  const textNoteList = document.getElementById('textNoteList');
  const imageNoteList = document.getElementById('imageNoteList');
  const createNoteBtn = document.getElementById('createNoteBtn');
  const newNoteContainer = document.getElementById('newNoteContainer');
  const newNoteText = document.getElementById('newNoteText');
  const saveNewNoteBtn = document.getElementById('saveNewNoteBtn');
  const cancelNewNoteBtn = document.getElementById('cancelNewNoteBtn');

  const textTabBtn = document.getElementById('textTabBtn');
  const imageTabBtn = document.getElementById('imageTabBtn');
  const textTab = document.getElementById('textTab');
  const imageTab = document.getElementById('imageTab');

  const copyBtn = document.getElementById('copyBtn');
  const editBtn = document.getElementById('editBtn');
  const deleteBtn = document.getElementById('deleteBtn');
  const saveImageBtn = document.getElementById('saveImageBtn');

  const deleteModal = document.getElementById('deleteModal');
  const deleteMessage = document.getElementById('deleteMessage');
  const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
  const cancelDeleteBtn = document.getElementById('cancelDeleteBtn');

  let allNotes = [];

  function renderNotes(notes) {
    allNotes = notes;
    textNoteList.innerHTML = '';
    imageNoteList.innerHTML = '';

    notes.forEach((note, index) => {
      const li = document.createElement('li');
      li.classList.add('note-item', 'fade-in');
      li.dataset.index = index;
      li.dataset.type = note.text ? 'text' : 'image';

      const content = document.createElement('div');
      content.className = 'note-content';

      const timestampDiv = document.createElement('div');
      timestampDiv.className = 'timestamp';
      timestampDiv.innerHTML = `<span class="date">${note.time || 'Không rõ'}</span>`;

      content.appendChild(timestampDiv);

      if (note.text) {
        const textDiv = document.createElement('div');
        textDiv.className = 'text-content';
        // Đảm bảo hiển thị xuống dòng
        textDiv.innerHTML = note.text.replace(/\n/g, '<br>');
        content.appendChild(textDiv);
        textNoteList.appendChild(li);
      } else if (note.image) {
        const img = document.createElement('img');
        img.src = note.image;
        img.className = 'note-image';
        content.appendChild(img);
        imageNoteList.appendChild(li);
      }

      li.appendChild(content);

      li.addEventListener('click', () => {
        li.classList.toggle('selected');
        updateActionButtons();
      });
    });
  }

  function updateActionButtons() {
    const selected = document.querySelectorAll('.note-item.selected');
    const textSelected = Array.from(selected).filter(li => li.dataset.type === 'text');
    const imageSelected = Array.from(selected).filter(li => li.dataset.type === 'image');

    copyBtn.disabled = !(textSelected.length === 1);
    editBtn.disabled = !(textSelected.length === 1);
    deleteBtn.disabled = selected.length === 0;
    saveImageBtn.disabled = !(imageSelected.length === 1);
  }

  deleteBtn.addEventListener('click', () => {
    const selected = document.querySelectorAll('.note-item.selected');
    if (selected.length === 0) return;

    deleteMessage.textContent = `Bạn có chắc chắn muốn xóa ${selected.length} ghi chú?`;
    deleteModal.style.display = 'flex';

    confirmDeleteBtn.onclick = () => {
      selected.forEach(li => {
        li.classList.add('mist-effect');
      });

      setTimeout(() => {
        const indexes = Array.from(selected).map(li => parseInt(li.dataset.index));
        const filteredNotes = allNotes.filter((_, i) => !indexes.includes(i));

        chrome.storage.local.set({ notes: filteredNotes }, () => {
          renderNotes(filteredNotes);
          shootConfetti(); // Bắn pháo hoa mỗi khi xóa bất kỳ ghi chú nào
        });
      }, 400);
      deleteModal.style.display = 'none';
    };

    cancelDeleteBtn.onclick = () => {
      deleteModal.style.display = 'none';
    };
  });

  function shootConfetti() {
    for (let i = 0; i < 20; i++) {
      const confetti = document.createElement('div');
      confetti.className = 'confetti';
      confetti.style.left = `${Math.random() * 100}%`;
      confetti.style.top = `${Math.random() * 100}%`;
      confetti.style.setProperty('--random-x', (Math.random() * 2 - 1).toFixed(2));
      confetti.style.setProperty('--random-y', (Math.random() * 2 - 1).toFixed(2));
      confetti.style.backgroundColor = `hsl(${Math.floor(Math.random() * 360)}, 70%, 60%)`;
      document.body.appendChild(confetti);

      setTimeout(() => {
        confetti.remove();
      }, 800);
    }
  }

  copyBtn.addEventListener('click', async () => {
    const selected = document.querySelector('.note-item.selected');
    if (!selected) return;

    const index = selected.dataset.index;
    const note = allNotes[index];

    if (note.text) {
      await navigator.clipboard.writeText(note.text);
      alert('Đã sao chép ghi chú!');
    }
  });

  editBtn.addEventListener('click', () => {
    const selected = document.querySelector('.note-item.selected');
    if (!selected) return;

    const index = selected.dataset.index;
    const note = allNotes[index];

    const contentDiv = selected.querySelector('.note-content');
    const textDiv = contentDiv.querySelector('.text-content');
    const originalText = note.text;

    textDiv.innerHTML = '';
    const textarea = document.createElement('textarea');
    textarea.className = 'edit-textarea';
    textarea.value = originalText;
    textDiv.appendChild(textarea);

    // Tự động tăng chiều cao theo nội dung ghi chú
    textarea.style.height = 'auto';
    textarea.style.height = textarea.scrollHeight + 'px';
    textarea.addEventListener('input', function() {
      this.style.height = 'auto';
      this.style.height = this.scrollHeight + 'px';
    });

    const buttonContainer = document.createElement('div');
    buttonContainer.className = 'edit-button-container';
    const saveBtn = document.createElement('button');
    saveBtn.className = 'save-button';
    saveBtn.textContent = 'Lưu';
    const cancelBtn = document.createElement('button');
    cancelBtn.className = 'cancel-button';
    cancelBtn.textContent = 'Hủy';
    buttonContainer.appendChild(saveBtn);
    buttonContainer.appendChild(cancelBtn);
    contentDiv.appendChild(buttonContainer);

    saveBtn.addEventListener('click', () => {
      const newText = textarea.value;
      if (newText) {
        note.text = newText;
        chrome.storage.local.set({ notes: allNotes }, () => {
          renderNotes(allNotes);
        });
      }
    });

    cancelBtn.addEventListener('click', () => {
      renderNotes(allNotes); // Hủy chỉnh sửa, render lại danh sách
    });
  });

  saveImageBtn.addEventListener('click', () => {
    const selected = document.querySelector('.note-item.selected');
    if (!selected) return;

    const index = selected.dataset.index;
    const note = allNotes[index];

    const a = document.createElement('a');
    a.href = note.image;
    a.download = `image_${new Date().getTime()}.png`;
    a.click();
  });

  createNoteBtn.addEventListener('click', () => {
    newNoteContainer.style.display = 'block';
    newNoteContainer.classList.add('fade-in');
    newNoteText.focus();
  });

  saveNewNoteBtn.addEventListener('click', () => {
    const text = newNoteText.value;
    if (text) {
      const now = new Date();
      const formattedTime = now.toLocaleDateString('vi-VN') + ' [ ' + now.toLocaleTimeString('vi-VN') + ' ]';
      allNotes.unshift({ text, time: formattedTime });
      chrome.storage.local.set({ notes: allNotes }, () => {
        renderNotes(allNotes);
        newNoteText.value = '';
        newNoteContainer.style.display = 'none';
      });
    }
  });

  cancelNewNoteBtn.addEventListener('click', () => {
    newNoteText.value = '';
    newNoteContainer.style.display = 'none';
  });

  textTabBtn.addEventListener('click', () => {
    textTabBtn.classList.add('active');
    imageTabBtn.classList.remove('active');
    textTab.classList.add('active');
    imageTab.classList.remove('active');
  });

  imageTabBtn.addEventListener('click', () => {
    imageTabBtn.classList.add('active');
    textTabBtn.classList.remove('active');
    imageTab.classList.add('active');
    textTab.classList.remove('active');
  });

  chrome.storage.local.get({ notes: [] }, (data) => {
    renderNotes(data.notes);
  });

  // Xuất JSON notes
  const exportJsonBtn = document.getElementById('exportJsonBtn');
  const importJsonBtn = document.getElementById('importJsonBtn');
  const fileInput = document.getElementById('fileInput');

  exportJsonBtn.addEventListener('click', () => {
    chrome.storage.local.get({ notes: [] }, data => {
      const blob = new Blob([JSON.stringify(data.notes, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'notes.json';
      a.click();
      URL.revokeObjectURL(url);
    });
  });

  importJsonBtn.addEventListener('click', () => {
    fileInput.click();
  });

  fileInput.addEventListener('change', () => {
    const file = fileInput.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = e => {
      try {
        const imported = JSON.parse(e.target.result);
        if (Array.isArray(imported)) {
          chrome.storage.local.set({ notes: imported }, () => {
            renderNotes(imported);
          });
        } else {
          throw new Error('Invalid format');
        }
      } catch {
        alert('File JSON không hợp lệ');
      }
    };
    reader.readAsText(file);
  });

});