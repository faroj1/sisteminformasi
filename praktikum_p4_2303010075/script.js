     document.getElementById("year").textContent = new Date().getFullYear();
   
  // Menu aktif otomatis
    const currentPage = window.location.pathname.split("/").pop(); 
    const menuItems = document.querySelectorAll("#menu a");
    menuItems.forEach(item => {
        if(item.getAttribute("href") === currentPage){
            item.classList.add("active");
        }
    });

     // Form handling
        document.addEventListener('DOMContentLoaded', function() {
            const steps = document.querySelectorAll(".form-step");
            let currentStep = 0;
            const progressBar = document.getElementById("progressBar");
            const form = document.getElementById("pmbForm");

            // Fungsi untuk menampilkan step
            const showStep = (stepIndex) => {
                steps.forEach((step, index) => {
                    step.classList.toggle("active", index === stepIndex);
                    if(index === stepIndex) {
                        setTimeout(() => step.style.opacity = "1", 50);
                    } else {
                        step.style.opacity = "0";
                    }
                });
                progressBar.style.width = ((stepIndex + 1) / steps.length * 100) + "%";
                window.scrollTo({ top: 0, behavior: 'smooth' });
            };

            // Validasi input
            const validateStep = (step) => {
                const inputs = step.querySelectorAll("input:not([type='file']), select, textarea");
                let isValid = true;

                inputs.forEach(input => {
                    // Hanya validasi jika field sudah disentuh atau form disubmit
                    if (input.classList.contains('touched') || form.classList.contains('submitted')) {
                        if (input.required && !input.value) {
                            isValid = false;
                            input.classList.add('invalid');
                            input.classList.remove('valid');
                            showError(input, 'Kolom ini harus diisi');
                        } else if (input.pattern && !new RegExp(input.pattern).test(input.value)) {
                            isValid = false;
                            input.classList.add('invalid');
                            input.classList.remove('valid');
                            showError(input, 'Format input tidak sesuai');
                        } else {
                            input.classList.remove('invalid');
                            input.classList.add('valid');
                            removeError(input);
                        }
                    }
                });

                return isValid;
            };

            // Tambahkan event listener untuk menandai field yang sudah disentuh
            const addTouchListeners = () => {
                document.querySelectorAll("input:not([type='file']), select, textarea").forEach(input => {
                    input.addEventListener('blur', () => {
                        input.classList.add('touched');
                        validateStep(input.closest('.form-step'));
                    });
                    input.addEventListener('input', () => {
                        if (input.classList.contains('touched')) {
                            validateStep(input.closest('.form-step'));
                        }
                    });
                });
            };

            addTouchListeners();

            // Error handling
            const showError = (input, message) => {
                let errorDiv = input.nextElementSibling;
                if (!errorDiv || !errorDiv.classList.contains('error-message')) {
                    errorDiv = document.createElement('div');
                    errorDiv.className = 'error-message';
                    errorDiv.style.color = '#dc3545';
                    errorDiv.style.fontSize = '0.8em';
                    errorDiv.style.marginTop = '5px';
                    input.parentNode.insertBefore(errorDiv, input.nextSibling);
                }
                errorDiv.textContent = message;
            };

            const removeError = (input) => {
                const errorDiv = input.nextElementSibling;
                if (errorDiv && errorDiv.classList.contains('error-message')) {
                    errorDiv.remove();
                }
            };

            // Navigation
            const next = () => {
                if (validateStep(steps[currentStep])) {
                    currentStep++;
                    showStep(currentStep);
                }
            };

            const prev = () => {
                currentStep--;
                showStep(currentStep);
            };

            // Event listeners untuk tombol navigasi
            document.querySelectorAll('[id^="next"]').forEach(button => {
                button.addEventListener('click', next);
            });

            document.querySelectorAll('[id^="prev"]').forEach(button => {
                button.addEventListener('click', prev);
            });

            // Jurusan SMK handling
            const jurusanSelect = document.getElementById("jurusan_faroj");
            const smkBox = document.getElementById("smkJurusanBox");
            
            jurusanSelect.addEventListener("change", () => {
                const isSmk = jurusanSelect.value === "SMK";
                smkBox.style.display = isSmk ? "block" : "none";
                const smkInput = smkBox.querySelector("input");
                smkInput.required = isSmk;
                if (!isSmk) {
                    smkInput.value = "";
                }
            });

            // Prodi selection handling
            const prodi1 = document.getElementById("prodi1_faroj");
            const prodi2 = document.getElementById("prodi2_faroj");
            
            const updateProdiOptions = () => {
                const selected = prodi1.value;
                Array.from(prodi2.options).forEach(opt => {
                    opt.disabled = opt.value === selected && opt.value !== "";
                });
                if (prodi2.value === selected) {
                    prodi2.value = "";
                }
            };

            prodi1.addEventListener("change", updateProdiOptions);

            // File input validation
            document.querySelectorAll('input[type="file"]').forEach(input => {
                input.addEventListener('change', function() {
                    const file = this.files[0];
                    const maxSize = 5 * 1024 * 1024; // 5MB

                    if (file) {
                        if (file.size > maxSize) {
                            showError(this, 'Ukuran file tidak boleh lebih dari 5MB');
                            this.value = '';
                        } else {
                            removeError(this);
                        }
                    }
                });
            });

            // Form submission
            form.addEventListener('submit', function(e) {
                e.preventDefault();
                if (validateStep(steps[currentStep])) {
                    // Simulasi pengiriman form
                    const submitButton = this.querySelector('button[type="submit"]');
                    submitButton.disabled = true;
                    submitButton.textContent = 'Mengirim...';
                    
                    setTimeout(() => {
                        alert('Data berhasil dikirim!');
                        location.reload();
                    }, 2000);
                }
            });
        });