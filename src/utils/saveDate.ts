const saveDate = (selectedDate: string, eventName: string | null = null) => {
  if (!selectedDate) {
    alert("Silakan pilih tanggal terlebih dahulu.");
    return;
  }
  if (!eventName) {
    alert("Silakan masukkan nama event.");
    return;
  }

  // Format tanggal untuk URL skema kalender (contoh: Google Calendar)
  const date = new Date(selectedDate);
  const year = date.getFullYear();
  const month = date.getMonth() + 1; // Bulan dimulai dari 0
  const day = date.getDate();

  // Membuat URL untuk Google Calendar
  const calendarUrl = `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(eventName)}&dates=${year}${("0" + month).slice(-2)}${("0" + day).slice(-2)}T120000Z/${year}${("0" + month).slice(-2)}${("0" + day).slice(-2)}T130000Z&details=Event%20Details&location=Location`;

  // Buka URL di jendela baru
  window.open(calendarUrl, "_blank");
  return true;
};

export default saveDate;
