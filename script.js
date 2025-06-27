// Wait for the DOM to be fully loaded before running scripts
document.addEventListener('DOMContentLoaded', () => {

    // --- General Navigation ---
    const navigateTo = (url) => {
        window.location.href = url;
    };

    // --- Login Page Logic (login.html) ---
    const loginBtn = document.getElementById('loginBtn');
    if (loginBtn) {
        loginBtn.addEventListener('click', () => {
            const userType = document.querySelector('input[name="userType"]:checked').value;
            // This is a simulation. In a real app, you would validate credentials first.
            if (userType === 'admin') {
                navigateTo('admin-dashboard.html');
            } else {
                navigateTo('user-dashboard.html');
            }
        });
    }
    
    // --- Forgot Password Logic (forgot-password.html) ---
    const forgotPasswordForm = document.getElementById('forgotPasswordForm');
    const verificationSection = document.getElementById('verificationSection');
    const resetPasswordBtn = document.getElementById('resetPasswordBtn');
    const confirmResetBtn = document.getElementById('confirmResetBtn');
    
    if (resetPasswordBtn) {
        resetPasswordBtn.addEventListener('click', () => {
            if (forgotPasswordForm && verificationSection) {
                forgotPasswordForm.classList.add('hidden');
                verificationSection.classList.remove('hidden');
            }

            // Start the timer
            let timer = 120;
            const timerElement = document.getElementById('codeTimer');
            const resendBtn = document.getElementById('resendCodeBtn');
            const interval = setInterval(() => {
                let minutes = Math.floor(timer / 60);
                let seconds = timer % 60;
                seconds = seconds < 10 ? '0' + seconds : seconds;
                minutes = minutes < 10 ? '0' + minutes : minutes;
                
                if (timerElement) timerElement.textContent = `${minutes}:${seconds}`;
                timer--;

                if (timer < 0) {
                    clearInterval(interval);
                    if (timerElement) timerElement.textContent = "00:00";
                    if (resendBtn) resendBtn.disabled = false;
                }
            }, 1000);
        });
    }

    if (confirmResetBtn) {
        confirmResetBtn.addEventListener('click', () => {
             alert('تم تغيير كلمة المرور بنجاح!');
             navigateTo('index.html');
        });
    }

    // --- Register Page Logic (register.html) ---
    const registerBtn = document.getElementById('register-btn');
    if (registerBtn) {
        registerBtn.addEventListener('click', () => {
            alert('تم إنشاء الحساب بنجاح! سيتم توجيهك لصفحة تسجيل الدخول.');
            navigateTo('index.html');
        });
    }

    // --- User Dashboard Logic (user-dashboard.html) ---
    const userLogoutBtn = document.getElementById('userLogoutBtn');
    const userTabs = document.querySelectorAll('.user-tab');
    const userTabContents = document.querySelectorAll('.user-tab-content');

    if (userLogoutBtn) {
        userLogoutBtn.addEventListener('click', () => navigateTo('index.html'));
    }

    if(userTabs.length > 0) {
        userTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                userTabs.forEach(t => t.classList.remove('active'));
                userTabContents.forEach(c => c.classList.remove('active'));
                tab.classList.add('active');
                const tabContentId = tab.getAttribute('data-tab') + 'Tab';
                document.getElementById(tabContentId).classList.add('active');
            });
        });
    }

    // --- Admin Dashboard Logic (admin-dashboard.html) ---
    const adminLogoutBtn = document.getElementById('adminLogoutBtn');
    const adminTabs = document.querySelectorAll('.admin-tab');
    const adminTabContents = document.querySelectorAll('.admin-tab-content');

    if (adminLogoutBtn) {
        adminLogoutBtn.addEventListener('click', () => navigateTo('index.html'));
    }
    
    if (adminTabs.length > 0) {
        adminTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                adminTabs.forEach(t => t.classList.remove('active'));
                adminTabContents.forEach(c => c.classList.remove('active'));
                tab.classList.add('active');
                const tabContentId = tab.getAttribute('data-tab') + 'Tab';
                document.getElementById(tabContentId).classList.add('active');
            });
        });
    }

    // --- Barcode Scanner Logic (admin-dashboard.html) ---
    const startScanBtn = document.getElementById('startScanBtn');
    const stopScanBtn = document.getElementById('stopScanBtn');
    const scanResultContainer = document.getElementById('scanResult');
    const scannedCodeElement = document.getElementById('scannedCode');
    const readerElement = document.getElementById('reader');
    const scanResultDetails = document.getElementById('scanResultDetails');

    // Mock Database for demonstration purposes
    const mockInventory = {
        '10034567': {
            name: 'جهاز كمبيوتر HP EliteDesk',
            barcode: '10034567',
            user: 'أحمد محمد (12345)',
            status: 'سليم',
            statusColor: 'green',
            date: '15/06/2022'
        },
        '10045678': {
            name: 'شاشة Dell 24 بوصة',
            barcode: '10045678',
            user: 'أحمد محمد (12345)',
            status: 'سليم',
            statusColor: 'green',
            date: '15/06/2022'
        },
        '10067892': {
            name: 'طابعة HP LaserJet Pro',
            barcode: '10067892',
            user: 'سارة أحمد (23456)',
            status: 'تحتاج صيانة',
            statusColor: 'yellow',
            date: '20/08/2022'
        }
    };

    if (startScanBtn && typeof Html5Qrcode !== 'undefined') {
        const html5QrCode = new Html5Qrcode("reader");

        const onScanSuccess = (decodedText, decodedResult) => {
            scannedCodeElement.textContent = decodedText;
            scanResultContainer.classList.remove('hidden');
            
            // Look up the item in our mock inventory
            const item = mockInventory[decodedText];
            
            if (item) {
                // Populate the details section
                document.getElementById('detailItemName').textContent = item.name;
                document.getElementById('detailBarcode').textContent = item.barcode;
                document.getElementById('detailUser').textContent = item.user;
                const statusEl = document.getElementById('detailStatus');
                statusEl.textContent = item.status;
                
                // Reset and apply status colors
                statusEl.className = 'px-2 py-1 rounded-full text-xs'; 
                if (item.statusColor === 'green') {
                    statusEl.classList.add('bg-green-100', 'text-green-800');
                } else if (item.statusColor === 'yellow') {
                    statusEl.classList.add('bg-yellow-100', 'text-yellow-800');
                }

                document.getElementById('detailDate').textContent = item.date;
                scanResultDetails.classList.remove('hidden');
            } else {
                // If item is not found
                scanResultDetails.classList.add('hidden');
                scannedCodeElement.textContent = `لم يتم العثور على عهدة بالباركود: ${decodedText}`;
            }

            stopScanning();
        };

        const onScanFailure = (error) => { /* Ignore */ };
        
        const startScanning = () => {
             html5QrCode.start(
                { facingMode: "environment" },
                { fps: 10, qrbox: { width: 250, height: 250 } },
                onScanSuccess,
                onScanFailure
            ).then(() => {
                startScanBtn.classList.add('hidden');
                stopScanBtn.classList.remove('hidden');
                scanResultDetails.classList.add('hidden');
                scanResultContainer.classList.add('hidden');
            }).catch(err => {
                console.error("Failed to start QR code scanner.", err);
                const readerInfo = readerElement.querySelector('p');
                if(readerInfo) readerInfo.textContent = 'فشل في تشغيل الكاميرا.';
            });
        };

        const stopScanning = () => {
            html5QrCode.stop().then(() => {
                startScanBtn.classList.remove('hidden');
                stopScanBtn.classList.add('hidden');
            }).catch(err => {
                // This can fail if the scanner is not running, which is fine.
            });
        };

        startScanBtn.addEventListener('click', startScanning);
        stopScanBtn.addEventListener('click', stopScanning);
    }
});

// فتح النموذج
document.getElementById('addDeviceBtn').addEventListener('click', function() {
  document.getElementById('addDeviceModal').classList.remove('hidden');
});

// إغلاق النموذج
document.getElementById('closeAddDeviceModal').addEventListener('click', function() {
  document.getElementById('addDeviceModal').classList.add('hidden');
});

document.getElementById('cancelAddDevice').addEventListener('click', function() {
  document.getElementById('addDeviceModal').classList.add('hidden');
});

// إرسال النموذج
document.getElementById('addDeviceForm').addEventListener('submit', function(e) {
  e.preventDefault();
  
  // هنا يمكنك إضافة كود لإرسال البيانات إلى الخادم
  alert('تمت إضافة الجهاز بنجاح');
  document.getElementById('addDeviceModal').classList.add('hidden');
  this.reset();
  
  // إعادة تحميل قائمة الأجهزة أو إضافة الجهاز الجديد إلى القائمة
  loadDevices();
});

// وظيفة مسح الباركود
document.querySelector('#addDeviceForm button[type="button"]').addEventListener('click', function() {
  // هنا يمكنك إضافة كود لفتح الماسح الضوئي
  alert('سيتم فتح ماسح الباركود');
});