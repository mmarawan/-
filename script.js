document.addEventListener('DOMContentLoaded', () => {
    // --- Global Transition Logic ---
    const fadeScreen = document.querySelector('.fade-screen');
    const transitionDuration = 500; // milliseconds, matches CSS transition

    // Function to handle page transitions with fade-out
    function navigateWithTransition(url) {
        if (fadeScreen) {
            fadeScreen.classList.remove('active-fade'); // Start fade-out
            setTimeout(() => {
                window.location.href = url; // Navigate after transition
            }, transitionDuration);
        } else {
            window.location.href = url; // Fallback if fade-screen not found
        }
    }

    // On page load, fade in the content
    if (fadeScreen) {
        // Use a small timeout to ensure the browser registers the initial opacity: 0 before setting to 1
        setTimeout(() => {
            fadeScreen.classList.add('active-fade');
        }, 50);
    }

    // --- Message Display Utility (replaces alert()) ---
    // This function creates a temporary message box for user feedback
    function showMessage(message, type = 'info') {
        const messageBox = document.createElement('div');
        messageBox.className = `fixed top-4 right-4 z-50 p-4 rounded-md shadow-lg text-white text-sm`;
        if (type === 'info') {
            messageBox.classList.add('bg-blue-500');
        } else if (type === 'success') {
            messageBox.classList.add('bg-green-500');
        } else if (type === 'error') {
            messageBox.classList.add('bg-red-500');
        }
        messageBox.textContent = message;
        document.body.appendChild(messageBox);
        setTimeout(() => {
            messageBox.remove();
        }, 3000); // Message disappears after 3 seconds
    }


    // --- Login Page Logic (for login.html) ---
    const loginBtn = document.getElementById('login-btn');
    const registerLink = document.getElementById('register-link');
    const forgotPasswordLink = document.getElementById('forgot-password-link');
    const userTypeSelectors = document.querySelectorAll('input[name="user-type"]');
    const userTypeLabels = document.querySelectorAll('.user-type-label');

    // Check if login elements exist on the current page
    if (loginBtn) {
        // Event listener for the login button
        loginBtn.addEventListener('click', () => {
            const employeeId = document.getElementById('employee-id').value;
            const password = document.getElementById('password').value;
            const userType = document.querySelector('input[name="user-type"]:checked').value;

            if (employeeId && password) {
                // Simulate successful login and redirect based on user type
                if (userType === 'regular') {
                    navigateWithTransition('user_dashboard.html');
                } else if (userType === 'maintenance') {
                    navigateWithTransition('admin_dashboard.html');
                }
            } else {
                showMessage('الرجاء إدخال رقم العامل وكلمة المرور.', 'error');
            }
        });

        // Event listener for the register link
        if (registerLink) {
            registerLink.addEventListener('click', (e) => {
                e.preventDefault(); // Prevent default link behavior
                navigateWithTransition('register.html');
            });
        }

        // Event listener for the forgot password link
        if (forgotPasswordLink) {
            forgotPasswordLink.addEventListener('click', (e) => {
                e.preventDefault(); // Prevent default link behavior
                navigateWithTransition('forgot_password.html');
            });
        }

        // Add styling for user type selection on login page
        userTypeSelectors.forEach(radio => {
            radio.addEventListener('change', () => {
                userTypeLabels.forEach(label => label.classList.remove('selected'));
                document.querySelector(`label[for="${radio.id}"]`).classList.add('selected');
            });
        });
    }

    // --- Register Page Logic (for register.html) ---
    const registerNewAccountBtn = document.getElementById('register-btn');
    const backToLoginBtn = document.getElementById('back-to-login');

    // Check if register elements exist on the current page
    if (registerNewAccountBtn) {
        // Event listener for the register button
        registerNewAccountBtn.addEventListener('click', () => {
            const fullName = document.getElementById('full-name').value;
            const regEmployeeId = document.getElementById('reg-employee-id').value;
            const regPassword = document.getElementById('reg-password').value;
            const confirmPassword = document.getElementById('confirm-password').value;

            if (fullName && regEmployeeId && regPassword && (regPassword === confirmPassword)) {
                showMessage('تم إنشاء الحساب بنجاح! يمكنك الآن تسجيل الدخول.', 'success');
                navigateWithTransition('index.html'); // Redirect to login after registration
            } else {
                showMessage('الرجاء ملء جميع الحقول والتأكد من تطابق كلمات المرور.', 'error');
            }
        });

        // Event listener for the back to login button
        if (backToLoginBtn) {
            backToLoginBtn.addEventListener('click', () => {
                navigateWithTransition('index.html'); // Redirect to login
            });
        }
    }

    // --- Forgot Password Page Logic (for forgot_password.html) ---
    const backToLoginFromForgotBtn = document.getElementById('backToLoginBtn'); // Button in the initial form
    const backToLoginVerificationBtn = document.getElementById('backToLoginVerificationBtn'); // Button in the verification section
    const resetPasswordBtn = document.getElementById('resetPasswordBtn');
    const verificationSection = document.getElementById('verificationSection');
    const codeTimer = document.getElementById('codeTimer');
    const resendCodeBtn = document.getElementById('resendCodeBtn');
    const confirmResetBtn = document.getElementById('confirmResetBtn');
    const forgotPasswordForm = document.getElementById('forgotPasswordForm');
    const verificationInputs = document.querySelectorAll('#verificationSection input[maxlength="1"]');

    // Timer variables
    let timerInterval;
    let timeLeft = 120; // 2 minutes in seconds

    // Function to start the countdown timer
    function startTimer() {
        timeLeft = 120; // Reset to 2 minutes
        updateTimerDisplay();
        resendCodeBtn.disabled = true; // Disable resend button during countdown

        timerInterval = setInterval(() => {
            timeLeft--;
            updateTimerDisplay();
            if (timeLeft <= 0) {
                clearInterval(timerInterval);
                resendCodeBtn.disabled = false; // Enable resend button
                codeTimer.textContent = '00:00';
                showMessage('انتهى وقت رمز التحقق. يمكنك إعادة إرساله.', 'info');
            }
        }, 1000);
    }

    // Function to update the timer display
    function updateTimerDisplay() {
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        codeTimer.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }

    // Add auto-focus to verification code inputs
    if (verificationInputs.length > 0) {
        verificationInputs.forEach((input, index) => {
            input.addEventListener('input', () => {
                // Move focus to the next input if current one is filled
                if (input.value.length === input.maxLength && index < verificationInputs.length - 1) {
                    verificationInputs[index + 1].focus();
                }
            });

            input.addEventListener('keydown', (e) => {
                // Move focus to the previous input on backspace if current one is empty
                if (e.key === 'Backspace' && input.value.length === 0 && index > 0) {
                    verificationInputs[index - 1].focus();
                }
            });
        });
    }

    // Check if forgot password elements exist on the current page
    if (resetPasswordBtn) {
        // Event listener for "إرسال رمز التحقق" (Send Verification Code) button
        resetPasswordBtn.addEventListener('click', () => {
            const recoveryEmployeeId = document.getElementById('recovery-employee-id').value;
            const recoveryMobile = document.getElementById('recovery-mobile').value;

            if (recoveryEmployeeId && recoveryMobile) {
                // Simulate sending code (in a real app, this would be an API call)
                showMessage(`تم إرسال رمز التحقق إلى رقم الموبايل ${recoveryMobile}.`, 'success');
                forgotPasswordForm.classList.add('hidden'); // Hide the first form
                verificationSection.classList.remove('hidden'); // Show the verification section
                startTimer(); // Start the countdown
            } else {
                showMessage('الرجاء إدخال رقم العامل ورقم الموبايل.', 'error');
            }
        });

        // Event listener for "إعادة إرسال الرمز" (Resend Code) button
        if (resendCodeBtn) {
            resendCodeBtn.addEventListener('click', () => {
                showMessage('تم إعادة إرسال الرمز.', 'info');
                // Clear all verification input fields
                verificationInputs.forEach(input => {
                    input.value = '';
                });
                // Focus on the first input field after clearing
                if (verificationInputs.length > 0) {
                    verificationInputs[0].focus();
                }
                startTimer(); // Restart the timer
            });
        }

        // Event listener for "تغيير كلمة المرور" (Change Password) button
        if (confirmResetBtn) {
            confirmResetBtn.addEventListener('click', () => {
                const newPassword = document.getElementById('new-password').value;
                const confirmNewPassword = document.getElementById('confirm-new-password').value;
                let verificationCode = '';
                verificationInputs.forEach(input => {
                    verificationCode += input.value;
                });

                if (verificationCode.length === 4 && newPassword && newPassword === confirmNewPassword) {
                    // Simulate password reset (in a real app, this would be an API call)
                    showMessage('تم تغيير كلمة المرور بنجاح!', 'success');
                    clearInterval(timerInterval); // Stop timer if active
                    navigateWithTransition('index.html'); // Redirect to login
                } else {
                    showMessage('الرجاء التأكد من إدخال رمز التحقق الصحيح وتطابق كلمات المرور الجديدة.', 'error');
                }
            });
        }

        // Event listener for the first "العودة لتسجيل الدخول" button
        if (backToLoginFromForgotBtn) {
            backToLoginFromForgotBtn.addEventListener('click', (e) => {
                e.preventDefault(); // Prevent default link behavior
                clearInterval(timerInterval); // Stop timer if active
                navigateWithTransition('index.html'); // Redirect to login
            });
        }

        // Event listener for the second "العودة لتسجيل الدخول" button (in verification section)
        if (backToLoginVerificationBtn) {
            backToLoginVerificationBtn.addEventListener('click', (e) => {
                e.preventDefault(); // Prevent default link behavior
                clearInterval(timerInterval); // Stop timer if active
                navigateWithTransition('index.html'); // Redirect to login
            });
        }
    }

    // --- User Dashboard Logic (for user_dashboard.html) ---
    const logoutBtn = document.getElementById('logout-btn');
    const searchBtn = document.getElementById('search-btn');
    const submitIssueBtn = document.getElementById('submit-issue');

    // Check if user dashboard elements exist on the current page
    if (logoutBtn) {
        // Event listener for logout button
        logoutBtn.addEventListener('click', () => {
            showMessage('تم تسجيل الخروج بنجاح.', 'info');
            navigateWithTransition('index.html'); // Redirect to login
        });

        // User Dashboard Search Functionality
        if (searchBtn) {
            searchBtn.addEventListener('click', () => {
                const searchEmployeeId = document.getElementById('search-employee-id').value;
                const searchResultsDiv = document.getElementById('search-results');
                if (searchEmployeeId === '123456') { // Simulate a found user
                    searchResultsDiv.classList.remove('hidden');
                    // In a real app, you would fetch and display actual data here
                } else {
                    searchResultsDiv.classList.add('hidden');
                    showMessage('لم يتم العثور على عهدة لهذا العامل.', 'error');
                }
            });
        }

        // User Dashboard Report Issue
        if (submitIssueBtn) {
            submitIssueBtn.addEventListener('click', () => {
                const issueDevice = document.getElementById('issue-device').value;
                const issueType = document.getElementById('issue-type').value;
                const issueDescription = document.getElementById('issue-description').value;

                if (issueDevice && issueType && issueDescription) {
                    showMessage('تم إرسال بلاغك بنجاح. سيتم معالجته قريباً.', 'success');
                    // Clear form
                    document.getElementById('issue-device').value = '';
                    document.getElementById('issue-type').value = '';
                    document.getElementById('issue-description').value = '';
                } else {
                    showMessage('الرجاء ملء جميع حقول الإبلاغ عن المشكلة.', 'error');
                }
            });
        }
    }

    // --- Admin Dashboard Logic (for admin_dashboard.html) ---
    const adminLogoutBtn = document.getElementById('admin-logout-btn');
    const adminNavBtns = document.querySelectorAll('.admin-nav-btn');
    const adminSections = document.querySelectorAll('.admin-section');
    const addInventoryBtn = document.getElementById('add-inventory-btn');

    // Barcode Scanner specific elements
    const startScanBtn = document.getElementById('start-scan-btn');
    const stopScanBtn = document.getElementById('stop-scan-btn');
    const barcodeScannerVideo = document.getElementById('barcode-scanner-video');
    const scannerMessage = document.getElementById('scanner-message');
    const scannedSerialNumber = document.getElementById('scanned-serial-number');
    const scannedDeviceType = document.getElementById('scanned-device-type');
    const scannedModel = document.getElementById('scanned-model');
    const scannedStatus = document.getElementById('scanned-status');
    const scannedCurrentUser = document.getElementById('scanned-current-user');

    // Add New Device Modal elements
    const addDeviceModal = document.getElementById('addDeviceModal');
    const closeAddDeviceModalBtn = document.getElementById('closeAddDeviceModal');
    const cancelAddDeviceBtn = document.getElementById('cancelAddDevice');
    const saveNewDeviceBtn = document.getElementById('saveNewDevice');
    const addDeviceForm = document.getElementById('addDeviceForm');

    // Issue Details Modal elements
    const issueDetailsModal = document.getElementById('issueDetailsModal');
    const closeIssueDetailsModalBtn = document.getElementById('closeIssueDetailsModal');
    const cancelUpdateIssueBtn = document.getElementById('cancelUpdateIssue');
    const saveIssueUpdatesBtn = document.getElementById('saveIssueUpdates');
    const updateIssueForm = document.getElementById('updateIssueForm');

    // Elements to populate in Issue Details Modal
    const detailIssueId = document.getElementById('detail-issue-id');
    const detailIssueUser = document.getElementById('detail-issue-user');
    const detailIssueDevice = document.getElementById('detail-issue-device');
    const detailIssueType = document.getElementById('detail-issue-type');
    const detailIssueDate = document.getElementById('detail-issue-date');
    const detailIssueStatus = document.getElementById('detail-issue-status');
    const detailIssueDescription = document.getElementById('detail-issue-description');
    const updateIssueStatusSelect = document.getElementById('update-issue-status');
    const maintenanceNotes = document.getElementById('maintenance-notes');
    const issuesTableBody = document.getElementById('issues-table-body');
    const viewIssueDetailsBtns = document.querySelectorAll('.view-issue-details'); // Select all view buttons


    // Sample Issues Data (replace with real data from backend)
    const issuesData = [
        {
            id: 'ISS001',
            user: 'علي محمود',
            device: 'طابعة - PR12345678',
            type: 'مشكلة في الطباعة',
            date: '12/06/2025',
            status: 'in_progress',
            description: 'الجهاز يعمل ببطء شديد عند تشغيل برنامج معين. وأحيانًا يتوقف عن الاستجابة تمامًا. قمت بإعادة تشغيله عدة مرات لكن المشكلة لا تزال موجودة.',
            notes: 'تم فحص الجهاز وتبين وجود مشكلة في نظام التشغيل. جاري العمل على إعادة تثبيت البرامج الضرورية.'
        },
        {
            id: 'ISS002',
            user: 'أحمد محمد',
            device: 'لابتوب - LT78945612',
            type: 'بطء في الأداء',
            date: '01/06/2025',
            status: 'resolved',
            description: 'اللابتوب بطيء جداً ويستغرق وقتاً طويلاً لفتح التطبيقات.',
            notes: 'تم تحديث نظام التشغيل وتنظيف الجهاز من الملفات المؤقتة. يعمل بكفاءة الآن.'
        },
        {
            id: 'ISS003',
            user: 'محمد محمود',
            device: 'شاشة - SCMN987654',
            type: 'كسر في الشاشة',
            date: '14/06/2025',
            status: 'new',
            description: 'الشاشة سقطت وتوجد كسر واضح في الزاوية اليمنى السفلية.',
            notes: ''
        }
    ];

    // Sample Devices Data (for inventory management)
    // Extended devicesData to match the expected total count for demonstration
    // Sample Devices Data (for inventory management)
    const devicesData = [
        { id: '001', type: 'laptop', model: 'HP ProBook 450 G8', serial: 'LT78945612', status: 'in-use', user: 'أحمد محمد', notes: '' },
        { id: '002', type: 'desktop', model: 'Dell OptiPlex 7080', serial: 'PC45678923', status: 'in-use', user: 'محمد أحمد', notes: '' },
        { id: '003', type: 'printer', model: 'HP LaserJet Pro M404dn', serial: 'PR12345678', status: 'maintenance', user: 'علي محمود', notes: 'بحاجة إلى إصلاح رأس الطباعة.' },
        { id: '004', type: 'laptop', model: 'Dell Latitude 5420', serial: 'DL54201234', status: 'in-use', user: 'سارة عبد الله', notes: '' },
        { id: '005', type: 'monitor', model: 'Samsung Odyssey G7', serial: 'SMG7890123', status: 'in-use', user: 'خالد السيد', notes: '' },
        { id: '006', type: 'printer', model: 'Epson EcoTank ET-2760', serial: 'EP27604567', status: 'maintenance', user: 'ليلى فؤاد', notes: 'تحت الصيانة الدورية' },
        { id: '007', type: 'desktop', model: 'HP Pavilion Desktop', serial: 'HPPV009876', status: 'in-use', user: 'يوسف جمال', notes: '' },
        { id: '008', type: 'laptop', model: 'MacBook Air M1', serial: 'MBAIR12345', status: 'in-use', user: 'نور الدين', notes: '' }
    ];

    // Function to add dummy devices to reach a target count


    // Elements for Edit Device Modal
    const editDeviceModal = document.getElementById('editDeviceModal');
    const closeEditDeviceModalBtn = document.getElementById('closeEditDeviceModal');
    const cancelEditDeviceBtn = document.getElementById('cancelEditDevice');
    const saveEditedDeviceBtn = document.getElementById('saveEditedDevice');
    const editDeviceForm = document.getElementById('editDeviceForm');

    const editDeviceId = document.getElementById('edit-device-id');
    const editDeviceType = document.getElementById('edit-device-type');
    const editDeviceModel = document.getElementById('edit-device-model');
    const editDeviceSerial = document.getElementById('edit-device-serial');
    const editDeviceStatus = document.getElementById('edit-device-status');
    const editDeviceUser = document.getElementById('edit-device-user');
    const editDeviceNotes = document.getElementById('edit-device-notes');
    const inventoryTableBody = document.getElementById('inventory-table-body');

    // Elements for Reports Section Summary Cards
    const totalDevicesSpan = document.getElementById('total-devices');
    const usedDevicesSpan = document.getElementById('used-devices');
    const maintenanceDevicesSpan = document.getElementById('maintenance-devices');


    // Chart instances
    let deviceStatusChart = null;
    let deviceTypeChart = null;


    // Function to populate and display issues in the table
    function displayIssues(filter = 'all') {
        issuesTableBody.innerHTML = ''; // Clear current table

        const filteredIssues = issuesData.filter(issue => {
            if (filter === 'all') return true;
            return issue.status === filter;
        });

        filteredIssues.forEach(issue => {
            const row = document.createElement('tr');
            row.setAttribute('data-issue-id', issue.id);
            row.setAttribute('data-status', issue.status);

            let statusClass = '';
            let statusText = '';
            if (issue.status === 'new') {
                statusClass = 'bg-red-100 text-red-800';
                statusText = 'جديد';
            } else if (issue.status === 'in_progress') {
                statusClass = 'bg-yellow-100 text-yellow-800';
                statusText = 'قيد المعالجة';
            } else if (issue.status === 'resolved') {
                statusClass = 'bg-green-100 text-green-800';
                statusText = 'تم الحل';
            }

            row.innerHTML = `
                <td class="py-2 px-3 sm:px-4 border-b">${issue.id}</td>
                <td class="py-2 px-3 sm:px-4 border-b">${issue.device}</td>
                <td class="py-2 px-3 sm:px-4 border-b">${issue.user}</td>
                <td class="py-2 px-3 sm:px-4 border-b">${issue.type}</td>
                <td class="py-2 px-3 sm:px-4 border-b">${issue.date}</td>
                <td class="py-2 px-3 sm:px-4 border-b"><span class="px-2 py-1 ${statusClass} rounded-full text-xs">${statusText}</span></td>
                <td class="py-2 px-3 sm:px-4 border-b">
                    <div class="flex flex-col sm:flex-row space-y-1 sm:space-y-0 sm:space-x-1 space-x-reverse">
                        <button class="view-issue-details bg-primary-600 hover:bg-primary-700 text-white px-2 py-1 rounded-md text-xs" data-issue-id="${issue.id}">عرض التفاصيل</button>
                    </div>
                </td>
            `;
            issuesTableBody.appendChild(row);
        });

        // Re-attach event listeners for newly created buttons
        document.querySelectorAll('.view-issue-details').forEach(button => {
            button.addEventListener('click', (e) => {
                const issueId = e.target.getAttribute('data-issue-id');
                const issue = issuesData.find(item => item.id === issueId);
                if (issue) {
                    populateIssueDetailsModal(issue);
                    issueDetailsModal.classList.remove('hidden');
                }
            });
        });
    }

    // Function to populate the issue details modal
    function populateIssueDetailsModal(issue) {
        detailIssueId.textContent = issue.id;
        detailIssueUser.textContent = issue.user;
        detailIssueDevice.textContent = issue.device;
        detailIssueType.textContent = issue.type;
        detailIssueDate.textContent = issue.date;
        detailIssueDescription.textContent = issue.description;

        // Set status in dropdown and display text
        updateIssueStatusSelect.value = issue.status;
        let statusText = '';
        if (issue.status === 'new') statusText = 'جديد';
        else if (issue.status === 'in_progress') statusText = 'قيد المعالجة';
        else if (issue.status === 'resolved') statusText = 'تم الحل';
        detailIssueStatus.textContent = statusText;

        maintenanceNotes.value = issue.notes; // Populate notes
    }

    // Function to populate and display inventory in the table
    function displayInventory() {
        inventoryTableBody.innerHTML = ''; // Clear current table

        devicesData.forEach(device => {
            const row = document.createElement('tr');
            row.setAttribute('data-device-id', device.id);

            let statusClass = '';
            let statusText = '';
            if (device.status === 'available') {
                statusClass = 'bg-blue-100 text-blue-800';
                statusText = 'متاح';
            } else if (device.status === 'in-use') {
                statusClass = 'bg-green-100 text-green-800';
                statusText = 'مستخدم';
            } else if (device.status === 'maintenance') {
                statusClass = 'bg-yellow-100 text-yellow-800';
                statusText = 'تحت الصيانة';
            } else if (device.status === 'defective') {
                statusClass = 'bg-red-100 text-red-800';
                statusText = 'معطل';
            }

            row.innerHTML = `
                <td class="py-2 px-3 sm:px-4 border-b">${device.id}</td>
                <td class="py-2 px-3 sm:px-4 border-b">${device.type === 'laptop' ? 'لابتوب' : device.type === 'desktop' ? 'جهاز مكتبي' : device.type === 'printer' ? 'طابعة' : device.type === 'monitor' ? 'شاشة' : device.type}</td>
                <td class="py-2 px-3 sm:px-4 border-b">${device.model}</td>
                <td class="py-2 px-3 sm:px-4 border-b">${device.serial}</td>
                <td class="py-2 px-3 sm:px-4 border-b"><span class="px-2 py-1 ${statusClass} rounded-full text-xs">${statusText}</span></td>
                <td class="py-2 px-3 sm:px-4 border-b">${device.user || '-'}</td>
                <td class="py-2 px-3 sm:px-4 border-b">
                    <div class="flex flex-col sm:flex-row space-y-1 sm:space-y-0 sm:space-x-1 space-x-reverse">
                        <button class="edit-device-btn bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded-md text-xs" data-device-id="${device.id}">تعديل</button>
                        <button class="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded-md text-xs">حذف</button>
                    </div>
                </td>
            `;
            inventoryTableBody.appendChild(row);
        });

        // Re-attach event listeners for newly created "تعديل" buttons
        document.querySelectorAll('.edit-device-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const deviceId = e.target.getAttribute('data-device-id');
                const device = devicesData.find(item => item.id === deviceId);
                if (device) {
                    populateEditDeviceModal(device);
                    editDeviceModal.classList.remove('hidden'); // Show the modal
                }
            });
        });
    }

    // Function to populate the Edit Device Modal
    function populateEditDeviceModal(device) {
        editDeviceId.value = device.id;
        editDeviceType.value = device.type;
        editDeviceModel.value = device.model;
        editDeviceSerial.value = device.serial;
        editDeviceStatus.value = device.status;
        editDeviceUser.value = device.user;
        editDeviceNotes.value = device.notes;
    }

    // --- Chart Functions ---
    function updateReportSummary() {
        // Ensure the elements exist before trying to update them
        const totalDevicesElem = document.getElementById('total-devices');
        const usedDevicesElem = document.getElementById('used-devices');
        const maintenanceDevicesElem = document.getElementById('maintenance-devices');

        if (!totalDevicesElem || !usedDevicesElem || !maintenanceDevicesElem) return;

        const total = devicesData.length;
        const inUse = devicesData.filter(d => d.status === 'in-use').length;
        const maintenance = devicesData.filter(d => d.status === 'maintenance').length;

        // Update the actual spans in the HTML
        totalDevicesElem.textContent = total;
        usedDevicesElem.textContent = inUse;
        maintenanceDevicesElem.textContent = maintenance;

        // Calculate and update the percentage for used devices
        if (total > 0) {
            document.querySelector('#reports-section .summary-card:nth-child(2) .text-xs.text-gray-600').textContent = `${((inUse / total) * 100).toFixed(0)}% من الإجمالي`;
        } else {
            document.querySelector('#reports-section .summary-card:nth-child(2) .text-xs.text-gray-600').textContent = `0% من الإجمالي`;
        }


        // The hardcoded values for "this month/week" will remain as they are not tied to dynamic data in `devicesData`.
    }


    function renderCharts() {
        renderDeviceStatusChart();
        renderDeviceTypeChart();
    }

    function renderDeviceStatusChart() {
        const ctx = document.getElementById('deviceStatusChart');
        if (!ctx) return;

        // Count devices by status
        const statusCounts = {
            'available': 0,
            'in-use': 0,
            'maintenance': 0,
            'defective': 0
        };
        devicesData.forEach(device => {
            if (statusCounts.hasOwnProperty(device.status)) {
                statusCounts[device.status]++;
            }
        });

        const data = {
            labels: ['متاح', 'مستخدم', 'تحت الصيانة', 'معطل'],
            datasets: [{
                label: 'عدد الأجهزة',
                data: [
                    statusCounts['available'],
                    statusCounts['in-use'],
                    statusCounts['maintenance'],
                    statusCounts['defective']
                ],
                backgroundColor: [
                    'rgba(59, 130, 246, 0.7)', // blue-500 (متاح)
                    'rgba(34, 197, 94, 0.7)',  // green-500 (مستخدم)
                    'rgba(234, 179, 8, 0.7)',  // yellow-500 (تحت الصيانة)
                    'rgba(239, 68, 68, 0.7)'   // red-500 (معطل)
                ],
                borderColor: [
                    'rgba(59, 130, 246, 1)',
                    'rgba(34, 197, 94, 1)',
                    'rgba(234, 179, 8, 1)',
                    'rgba(239, 68, 68, 1)'
                ],
                borderWidth: 1
            }]
        };

        const config = {
            type: 'bar',
            data: data,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false // Hide legend for simplicity as labels are clear
                    },
                    title: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'عدد الأجهزة',
                            font: {
                                family: 'Tajawal',
                                size: 14
                            }
                        },
                        ticks: {
                            callback: function (value) {
                                if (Number.isInteger(value)) {
                                    return value;
                                }
                            },
                            font: {
                                family: 'Tajawal'
                            }
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'الحالة',
                            font: {
                                family: 'Tajawal',
                                size: 14
                            }
                        },
                        ticks: {
                            font: {
                                family: 'Tajawal'
                            }
                        }
                    }
                }
            },
        };

        if (deviceStatusChart) {
            deviceStatusChart.destroy(); // Destroy existing chart if it exists
        }
        deviceStatusChart = new Chart(ctx, config);
    }

    function renderDeviceTypeChart() {
        const ctx = document.getElementById('deviceTypeChart');
        if (!ctx) return;

        // Count devices by type
        const typeCounts = {};
        let totalDevices = 0;
        devicesData.forEach(device => {
            typeCounts[device.type] = (typeCounts[device.type] || 0) + 1;
            totalDevices++;
        });

        // Prepare labels and data for the pie chart
        const labels = [];
        const dataValues = [];
        const backgroundColors = [];
        const borderColors = [];

        // Define a set of colors for different device types
        const colorPalette = {
            'laptop': 'rgba(128, 0, 128, 0.7)', // Purple
            'desktop': 'rgba(255, 165, 0, 0.7)', // Orange
            'printer': 'rgba(0, 128, 128, 0.7)', // Teal
            'monitor': 'rgba(75, 192, 192, 0.7)', // Light Blue
            'other': 'rgba(192, 192, 192, 0.7)' // Grey
        };
        const borderPalette = {
            'laptop': 'rgba(128, 0, 128, 1)',
            'desktop': 'rgba(255, 165, 0, 1)',
            'printer': 'rgba(0, 128, 128, 1)',
            'monitor': 'rgba(75, 192, 192, 1)',
            'other': 'rgba(192, 192, 192, 1)'
        };

        for (const type in typeCounts) {
            const percentage = ((typeCounts[type] / totalDevices) * 100).toFixed(0);
            let displayType = '';
            if (type === 'laptop') displayType = 'لابتوب';
            else if (type === 'desktop') displayType = 'جهاز مكتبي';
            else if (type === 'printer') displayType = 'طابعة';
            else if (type === 'monitor') displayType = 'شاشة';
            else if (type === 'other') displayType = 'أخرى';

            labels.push(`${displayType} (${percentage}%)`);
            dataValues.push(typeCounts[type]);
            backgroundColors.push(colorPalette[type] || 'rgba(0, 0, 0, 0.7)'); // Fallback color
            borderColors.push(borderPalette[type] || 'rgba(0, 0, 0, 1)');
        }

        const data = {
            labels: labels,
            datasets: [{
                data: dataValues,
                backgroundColor: backgroundColors,
                borderColor: borderColors,
                borderWidth: 1
            }]
        };

        const config = {
            type: 'pie',
            data: data,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'right', // Position legend to the right as in the image
                        labels: {
                            font: {
                                family: 'Tajawal' // Apply font to legend labels
                            }
                        }
                    },
                    title: {
                        display: false
                    }
                }
            },
        };

        if (deviceTypeChart) {
            deviceTypeChart.destroy(); // Destroy existing chart if it exists
        }
        deviceTypeChart = new Chart(ctx, config);
    }


    // Check if admin dashboard elements exist on the current page
    if (adminLogoutBtn) {
        // Event listener for admin logout button
        adminLogoutBtn.addEventListener('click', () => {
            showMessage('تم تسجيل الخروج بنجاح.', 'info');
            navigateWithTransition('index.html'); // Redirect to login
        });

        // Admin Dashboard Navigation (internal to this page)
        adminNavBtns.forEach(button => {
            button.addEventListener('click', () => {
                // Stop scanner if moving away from barcode section
                // Check if Quagga is initialized before trying to stop it
                if (button.getAttribute('data-target') !== 'barcode' && typeof Quagga !== 'undefined' && Quagga.initialized) {
                    Quagga.stop();
                    console.log('QuaggaJS stopped.');
                    barcodeScannerVideo.style.display = 'none';
                    startScanBtn.classList.remove('hidden');
                    stopScanBtn.classList.add('hidden');
                    scannerMessage.textContent = '';
                }

                // Remove active class from all navigation buttons and sections
                adminNavBtns.forEach(btn => {
                    btn.classList.remove('active', 'border-white');
                    btn.classList.add('opacity-70', 'border-transparent');
                });
                adminSections.forEach(section => section.classList.remove('active'));
                adminSections.forEach(section => section.classList.add('hidden'));

                // Add active class to clicked button and corresponding section
                button.classList.add('active', 'border-white');
                button.classList.remove('opacity-70', 'border-transparent');
                const targetSectionId = button.getAttribute('data-target') + '-section';
                document.getElementById(targetSectionId).classList.add('active');
                document.getElementById(targetSectionId).classList.remove('hidden');

                // If navigating to issues section, display issues
                if (button.getAttribute('data-target') === 'issues') {
                    displayIssues('all'); // Display all issues by default
                    // Set 'الكل' filter button as active
                    document.querySelectorAll('.filter-issue-btn').forEach(filterBtn => {
                        filterBtn.classList.remove('active', 'bg-primary-100', 'text-primary-700');
                        filterBtn.classList.add('bg-gray-100', 'text-gray-700');
                        if (filterBtn.getAttribute('data-filter') === 'all') {
                            filterBtn.classList.add('active', 'bg-primary-100', 'text-primary-700');
                            filterBtn.classList.remove('bg-gray-100', 'text-gray-700');
                        }
                    });
                } else if (button.getAttribute('data-target') === 'inventory') {
                    displayInventory(); // Display inventory when navigating to it
                } else if (button.getAttribute('data-target') === 'reports') {
                    updateReportSummary(); // Update summary cards
                    renderCharts(); // Render charts when navigating to reports section
                }
            });
        });

        // Admin Inventory Add Device button logic
        if (addInventoryBtn) {
            addInventoryBtn.addEventListener('click', () => {
                addDeviceModal.classList.remove('hidden'); // Show the modal
            });
        }

        // Add Device Modal close buttons logic
        if (closeAddDeviceModalBtn) {
            closeAddDeviceModalBtn.addEventListener('click', () => {
                addDeviceModal.classList.add('hidden'); // Hide the modal
                addDeviceForm.reset(); // Optionally clear the form
            });
        }
        if (cancelAddDeviceBtn) {
            cancelAddDeviceBtn.addEventListener('click', () => {
                addDeviceModal.classList.add('hidden'); // Hide the modal
                addDeviceForm.reset(); // Clear the form
            });
        }

        // Handle Add New Device Form Submission
        // في دالة حفظ الجهاز الجديد
        if (saveNewDeviceBtn) {
            saveNewDeviceBtn.addEventListener('click', (e) => {
                e.preventDefault();

                const deviceType = document.getElementById('new-device-type').value;
                const deviceModel = document.getElementById('new-device-model').value;
                const deviceSerial = document.getElementById('new-device-serial').value;
                const deviceStatus = document.getElementById('new-device-status').value;
                const deviceUser = document.getElementById('new-device-user').value;
                const receiptDate = document.getElementById('new-device-receipt-date').value;
                const deviceNotes = document.getElementById('new-device-notes').value;

                if (deviceType && deviceModel && deviceSerial && deviceStatus && receiptDate) {
                    // Simulate adding a new device to our local data
                    const newId = (devicesData.length + 1).toString().padStart(3, '0');
                    const newDevice = {
                        id: newId,
                        type: deviceType,
                        model: deviceModel,
                        serial: deviceSerial,
                        status: deviceStatus,
                        user: deviceUser,
                        receiptDate: receiptDate, // إضافة تاريخ الاستلام
                        notes: deviceNotes
                    };
                    devicesData.push(newDevice);
                    displayInventory();

                    showMessage('تم حفظ الجهاز الجديد بنجاح!', 'success');
                    addDeviceModal.classList.add('hidden');
                    addDeviceForm.reset();
                } else {
                    showMessage('الرجاء ملء جميع الحقول المطلوبة (النوع، الموديل، الرقم التسلسلي، الحالة، تاريخ الاستلام)', 'error');
                }
            });
        }

        // Edit Device Modal Close Buttons Logic
        if (closeEditDeviceModalBtn) {
            closeEditDeviceModalBtn.addEventListener('click', () => {
                editDeviceModal.classList.add('hidden');
                editDeviceForm.reset();
            });
        }
        if (cancelEditDeviceBtn) {
            cancelEditDeviceBtn.addEventListener('click', () => {
                editDeviceModal.classList.add('hidden');
                editDeviceForm.reset();
            });
        }

        // Handle Edit Device Form Submission
        if (saveEditedDeviceBtn) {
            saveEditedDeviceBtn.addEventListener('click', (e) => {
                e.preventDefault();

                const currentDeviceId = editDeviceId.value;
                const updatedDeviceType = editDeviceType.value;
                const updatedDeviceModel = editDeviceModel.value;
                const updatedDeviceSerial = editDeviceSerial.value;
                const updatedDeviceStatus = editDeviceStatus.value;
                const updatedDeviceUser = editDeviceUser.value;
                const updatedDeviceNotes = editDeviceNotes.value;

                const deviceIndex = devicesData.findIndex(item => item.id === currentDeviceId);

                if (deviceIndex > -1) {
                    devicesData[deviceIndex] = {
                        id: currentDeviceId,
                        type: updatedDeviceType,
                        model: updatedDeviceModel,
                        serial: updatedDeviceSerial,
                        status: updatedDeviceStatus,
                        user: updatedDeviceUser,
                        notes: updatedDeviceNotes
                    };
                    showMessage('تم حفظ تغييرات الجهاز بنجاح!', 'success');
                    displayInventory(); // Refresh the inventory table
                } else {
                    showMessage('خطأ: لم يتم العثور على الجهاز لتحديثه.', 'error');
                }

                editDeviceModal.classList.add('hidden');
                editDeviceForm.reset();
            });
        }


        // --- Barcode Scanner Logic Integration with QuaggaJS ---
        let scannerRunning = false; // Flag to track if the scanner is active

        const initScanner = () => {
            if (scannerRunning) return; // Prevent multiple initializations

            // Initialize QuaggaJS
            Quagga.init({
                inputStream: {
                    name: "Live",
                    type: "LiveStream",
                    target: barcodeScannerVideo, // Pass the video element directly
                    constraints: {
                        facingMode: "environment" // Prefer the rear camera
                    },
                },
                decoder: {
                    // Specify the types of barcodes to scan
                    readers: ["ean_reader", "code_128_reader", "upc_reader", "code_39_reader"]
                }
            }, function (err) {
                if (err) {
                    console.error(err);
                    scannerMessage.textContent = 'خطأ في تفعيل الكاميرا: ' + err.message;
                    showMessage('خطأ في تفعيل الكاميرا.', 'error');
                    return;
                }
                console.log("QuaggaJS Initialization finished. Starting tracking...");
                Quagga.start(); // Start the barcode scanner
                scannerRunning = true;
                barcodeScannerVideo.style.display = 'block'; // Show the video feed
                startScanBtn.classList.add('hidden'); // Hide start button
                stopScanBtn.classList.add('hidden'); // Ensure stop is hidden by default
                scannerMessage.textContent = 'ضع الباركود أمام الكاميرا للمسح...'; // Update user message
            });

            // Event listener for barcode detection
            Quagga.onDetected(function (result) {
                if (result.codeResult) {
                    const serialNumber = result.codeResult.code;
                    scannedSerialNumber.textContent = serialNumber;
                    // Simulate fetching device info based on serial number
                    scannedDeviceType.textContent = 'جاري البحث...';
                    scannedModel.textContent = 'جاري البحث...';
                    scannedStatus.textContent = 'جاري البحث...';
                    scannedCurrentUser.textContent = 'جاري البحث...';

                    showMessage(`تم مسح الباركود: ${serialNumber}`, 'success');

                    // Simulate a delay for fetching actual device data
                    setTimeout(() => {
                        // These would be replaced with actual data from a backend
                        const foundDevice = devicesData.find(d => d.serial === serialNumber);
                        if (foundDevice) {
                            scannedDeviceType.textContent = foundDevice.type === 'laptop' ? 'لابتوب' : foundDevice.type === 'desktop' ? 'جهاز مكتبي' : foundDevice.type === 'printer' ? 'طابعة' : foundDevice.type === 'monitor' ? 'شاشة' : foundDevice.type;
                            scannedModel.textContent = foundDevice.model;
                            scannedStatus.textContent = foundDevice.status === 'available' ? 'متاح' : foundDevice.status === 'in-use' ? 'مستخدم' : foundDevice.status === 'maintenance' ? 'تحت الصيانة' : foundDevice.status === 'defective' ? 'معطل' : foundDevice.status;
                            scannedCurrentUser.textContent = foundDevice.user || 'لا يوجد';
                        } else {
                            scannedDeviceType.textContent = 'غير موجود';
                            scannedModel.textContent = 'غير موجود';
                            scannedStatus.textContent = 'غير موجود';
                            scannedCurrentUser.textContent = 'غير موجود';
                            showMessage('لم يتم العثور على الجهاز بالرقم التسلسلي هذا.', 'error');
                        }
                    }, 1000); // Simulate 1 second network delay

                    Quagga.stop(); // Stop scanning after the first successful detection
                    scannerRunning = false;
                    barcodeScannerVideo.style.display = 'none'; // Hide video
                    startScanBtn.classList.remove('hidden'); // Show start button
                    stopScanBtn.classList.add('hidden'); // Hide stop button
                    scannerMessage.textContent = 'تم المسح بنجاح! تم تحديث معلومات الجهاز.'; // Final message
                }
            });

            // Optional: Live feedback for scan area
            Quagga.onProcessed(function (result) {
                var drawingCtx = Quagga.canvas.ctx.getImageData(),
                    drawingCanvas = Quagga.canvas.dom.getImageData();

                if (result) {
                    if (result.boxes) {
                        result.boxes.filter(function (box) {
                            return box !== result.box;
                        }).forEach(function (box) {
                            Quagga.ImageDebug.drawPath(box, { x: 0, y: 1 }, drawingCtx, { color: "green", lineWidth: 2 });
                        });
                    }

                    if (result.box) {
                        Quagga.ImageDebug.drawPath(result.box, { x: 0, y: 1 }, drawingCtx, { color: "#00F", lineWidth: 2 });
                    }

                    if (result.codeResult && result.codeResult.code) {
                        Quagga.ImageDebug.drawPath(result.line, { x: 'x', y: 'y' }, drawingCtx, { color: "red", lineWidth: 3 });
                    }
                }
            });
        };

        // Event listener to start the scanner
        if (startScanBtn) {
            startScanBtn.addEventListener('click', initScanner);
        }

        // Event listener to stop the scanner
        if (stopScanBtn) {
            stopScanBtn.addEventListener('click', () => {
                if (scannerRunning) {
                    Quagga.stop(); // Stop QuaggaJS
                    scannerRunning = false;
                    barcodeScannerVideo.style.display = 'none'; // Hide video feed
                    startScanBtn.classList.remove('hidden'); // Show start button
                    stopScanBtn.classList.add('hidden'); // Hide stop button
                    scannerMessage.textContent = 'تم إيقاف المسح.'; // Update message
                    showMessage('تم إيقاف الماسح الضوئي.', 'info');
                }
            });
        }

        // Admin Assign Device / Update Status (placeholder functionality)
        const assignDeviceBtn = document.getElementById('assign-device-btn');
        const updateStatusBtn = document.getElementById('update-status-btn');

        if (assignDeviceBtn) {
            assignDeviceBtn.addEventListener('click', () => {
                showMessage('وظيفة تخصيص الجهاز لمستخدم.', 'info');
            });
        }
        if (updateStatusBtn) {
            updateStatusBtn.addEventListener('click', () => {
                showMessage('وظيفة تحديث حالة الجهاز.', 'info');
            });
        }

        // --- Issue Details Modal Logic ---
        // Event listeners for View Details buttons (delegated)
        if (issuesTableBody) {
            issuesTableBody.addEventListener('click', (e) => {
                if (e.target.classList.contains('view-issue-details')) {
                    const issueId = e.target.getAttribute('data-issue-id');
                    const issue = issuesData.find(item => item.id === issueId);
                    if (issue) {
                        populateIssueDetailsModal(issue);
                        issueDetailsModal.classList.remove('hidden'); // Show the modal
                    }
                }
            });
        }

        // Issue Details Modal close buttons logic
        if (closeIssueDetailsModalBtn) {
            closeIssueDetailsModalBtn.addEventListener('click', () => {
                issueDetailsModal.classList.add('hidden'); // Hide the modal
                updateIssueForm.reset(); // Optionally clear the form
            });
        }
        if (cancelUpdateIssueBtn) {
            cancelUpdateIssueBtn.addEventListener('click', () => {
                issueDetailsModal.classList.add('hidden'); // Hide the modal
                updateIssueForm.reset(); // Clear the form
            });
        }

        // Handle Issue Details Form Submission (Save Changes)
        if (saveIssueUpdatesBtn) {
            saveIssueUpdatesBtn.addEventListener('click', (e) => {
                e.preventDefault(); // Prevent default form submission

                const currentIssueId = detailIssueId.textContent; // Get the ID of the issue being viewed
                const newStatus = updateIssueStatusSelect.value;
                const notes = maintenanceNotes.value;

                // Find the issue in our sample data and update it
                const issueIndex = issuesData.findIndex(item => item.id === currentIssueId);
                if (issueIndex > -1) {
                    issuesData[issueIndex].status = newStatus;
                    issuesData[issueIndex].notes = notes;
                    showMessage('تم حفظ تغييرات البلاغ بنجاح!', 'success');
                    displayIssues(document.querySelector('.filter-issue-btn.active').getAttribute('data-filter')); // Refresh table with current filter
                } else {
                    showMessage('خطأ: لم يتم العثور على البلاغ لتحديثه.', 'error');
                }

                issueDetailsModal.classList.add('hidden');
                updateIssueForm.reset();
            });
        }

        // Filter buttons logic
        document.querySelectorAll('.filter-issue-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                // Remove active class from all filter buttons
                document.querySelectorAll('.filter-issue-btn').forEach(btn => {
                    btn.classList.remove('active', 'bg-primary-100', 'text-primary-700');
                    btn.classList.add('bg-gray-100', 'text-gray-700');
                });

                // Add active class to the clicked button
                e.target.classList.add('active', 'bg-primary-100', 'text-primary-700');
                e.target.classList.remove('bg-gray-100', 'text-gray-700');

                const filter = e.target.getAttribute('data-filter');
                displayIssues(filter); // Re-display issues with the selected filter
            });
        });

        // Initial display of issues when admin dashboard is loaded
        // This will be called when the 'admin-dashboard' div itself becomes 'active' due to navigation
        if (document.getElementById('issues-section') && document.getElementById('issues-section').classList.contains('active')) {
            displayIssues('all');
        }

        // Initial display of inventory when admin dashboard is loaded and inventory section is active
        if (document.getElementById('inventory-section') && document.getElementById('inventory-section').classList.contains('active')) {
            displayInventory();
        }

        // Initial rendering of charts and summary if the reports section is the default active section
        // Or when navigating to the reports section
        if (document.getElementById('reports-section') && document.getElementById('reports-section').classList.contains('active')) {
            updateReportSummary();
            renderCharts();
        }
    }
});

// عند النقر على زر التعديل في الجدول
document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('.edit-device-btn').forEach(btn => {
        btn.addEventListener('click', function () {
            const deviceId = this.getAttribute('data-device-id');
            const deviceRow = document.querySelector(`tr[data-device-id="${deviceId}"]`);

            // الحصول على بيانات الجهاز من الصف
            const deviceType = deviceRow.cells[1].textContent;
            const deviceModel = deviceRow.cells[2].textContent;
            const deviceSerial = deviceRow.cells[3].textContent;
            const deviceStatus = deviceRow.cells[4].querySelector('span').textContent;
            const deviceUser = deviceRow.cells[5].textContent;

            // تعبئة بيانات النموذج
            document.getElementById('edit-device-id').value = deviceId;
            document.getElementById('edit-device-id-display').textContent = deviceId;
            document.getElementById('edit-device-type-display').textContent = deviceType;
            document.getElementById('edit-device-model-display').textContent = deviceModel;
            document.getElementById('edit-device-serial-display').textContent = deviceSerial;

            // تعيين الحالة الحالية
            const statusSelect = document.getElementById('edit-device-status');
            const statusMap = {
                'سليم': 'available',
                'مستخدم': 'in-use',
                'تحت الصيانة': 'maintenance',
                'معطل': 'defective'
            };
            statusSelect.value = statusMap[deviceStatus] || 'available';

            // تعيين المستخدم الحالي
            document.getElementById('edit-device-user').value = deviceUser === '-' ? '' : deviceUser;

            // عرض نافذة التعديل
            document.getElementById('editDeviceModal').classList.remove('hidden');
        });
    });

    // إغلاق نافذة التعديل
    document.getElementById('closeEditDeviceModal').addEventListener('click', function () {
        document.getElementById('editDeviceModal').classList.add('hidden');
    });

    document.getElementById('cancelEditDevice').addEventListener('click', function () {
        document.getElementById('editDeviceModal').classList.add('hidden');
    });
});
document.addEventListener('DOMContentLoaded', function () {
    // ربط حدث النقر على أزرار التعديل
    document.querySelectorAll('.edit-device-btn').forEach(btn => {
        btn.addEventListener('click', function () {
            const deviceId = this.getAttribute('data-device-id');
            const deviceRow = document.querySelector(`tr[data-device-id="${deviceId}"]`);

            // الحصول على بيانات الجهاز
            const deviceType = deviceRow.cells[1].textContent;
            const deviceModel = deviceRow.cells[2].textContent;
            const deviceSerial = deviceRow.cells[3].textContent;
            const deviceStatus = deviceRow.cells[4].querySelector('span').textContent;
            const deviceUser = deviceRow.cells[5].textContent;

            // تعبئة النموذج
            document.getElementById('edit-device-id').value = deviceId;
            document.getElementById('edit-device-id-display').textContent = deviceId;
            document.getElementById('edit-device-type-display').textContent = deviceType;
            document.getElementById('edit-device-model-display').textContent = deviceModel;
            document.getElementById('edit-device-serial-display').textContent = deviceSerial;

            // تعيين الحالة (تقتصر على المستخدم أو تحت الصيانة)
            const statusSelect = document.getElementById('edit-device-status');
            statusSelect.value = deviceStatus === 'تحت الصيانة' ? 'maintenance' : 'in-use';

            // تعيين المستخدم
            document.getElementById('edit-device-user').value = deviceUser === '-' ? '' : deviceUser;

            // عرض النافذة
            document.getElementById('editDeviceModal').classList.remove('hidden');
        });
    });

    // معالجة حفظ التعديلات
    document.getElementById('editDeviceForm').addEventListener('submit', function (e) {
        e.preventDefault();

        const deviceId = document.getElementById('edit-device-id').value;
        const newStatus = document.getElementById('edit-device-status').value;
        const newUser = document.getElementById('edit-device-user').value;

        // هنا يجب إضافة كود AJAX لحفظ التعديلات في الخادم

        // تحديث الجدول
        const deviceRow = document.querySelector(`tr[data-device-id="${deviceId}"]`);

        // تحديث الحالة
        const statusSpan = deviceRow.cells[4].querySelector('span');
        statusSpan.textContent = newStatus === 'maintenance' ? 'تحت الصيانة' : 'مستخدم';
        statusSpan.className = newStatus === 'maintenance'
            ? 'px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs'
            : 'px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs';

        // تحديث المستخدم
        deviceRow.cells[5].textContent = newUser || '-';

        // إغلاق النافذة
        document.getElementById('editDeviceModal').classList.add('hidden');

        // عرض رسالة نجاح
        alert('تم تحديث حالة الجهاز بنجاح');
    });

    // أحداث إغلاق النافذة
    document.getElementById('closeEditDeviceModal').addEventListener('click', function () {
        document.getElementById('editDeviceModal').classList.add('hidden');
    });

    document.getElementById('cancelEditDevice').addEventListener('click', function () {
        document.getElementById('editDeviceModal').classList.add('hidden');
    });
});
// عند النقر على زر التعديل في الجدول
document.querySelectorAll('.edit-device-btn').forEach(btn => {
    btn.addEventListener('click', function () {
        const deviceId = this.getAttribute('data-device-id');
        const deviceRow = document.querySelector(`tr[data-device-id="${deviceId}"]`);

        // الحصول على بيانات الجهاز من الصف
        const deviceType = deviceRow.cells[1].textContent;
        const deviceModel = deviceRow.cells[2].textContent;
        const deviceSerial = deviceRow.cells[3].textContent;
        const deviceStatus = deviceRow.cells[4].querySelector('span').textContent;
        const deviceUser = deviceRow.cells[5].textContent;

        // تعبئة بيانات النموذج
        document.getElementById('edit-device-id').value = deviceId;
        document.getElementById('edit-device-id-display').textContent = deviceId;
        document.getElementById('edit-device-type-display').textContent = deviceType;
        document.getElementById('edit-device-model-display').textContent = deviceModel;
        document.getElementById('edit-device-serial-display').textContent = deviceSerial;

        // تعيين الحالة الحالية
        const statusSelect = document.getElementById('edit-device-status');
        const statusMap = {
            'متاح': 'available',
            'مستخدم': 'in-use',
            'تحت الصيانة': 'maintenance',
            'معطل': 'defective'
        };
        statusSelect.value = statusMap[deviceStatus] || 'available';

        // تعيين المستخدم الحالي
        document.getElementById('edit-device-user').value = deviceUser === '-' ? '' : deviceUser;

        // عرض نافذة التعديل
        document.getElementById('editDeviceModal').classList.remove('hidden');
    });
});

// إغلاق نافذة التعديل
document.getElementById('closeEditDeviceModal').addEventListener('click', function () {
    document.getElementById('editDeviceModal').classList.add('hidden');
});

document.getElementById('cancelEditDevice').addEventListener('click', function () {
    document.getElementById('editDeviceModal').classList.add('hidden');
});

// معالجة حفظ التعديلات
document.getElementById('editDeviceForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const deviceId = document.getElementById('edit-device-id').value;
    const newStatus = document.getElementById('edit-device-status').value;
    const newUser = document.getElementById('edit-device-user').value;

    // هنا يجب إضافة كود لإرسال التعديلات إلى الخادم (AJAX)

    // محاكاة تحديث الجدول بعد الحفظ
    const deviceRow = document.querySelector(`tr[data-device-id="${deviceId}"]`);

    // تحديث الحالة
    const statusSpan = deviceRow.cells[4].querySelector('span');
    const statusTextMap = {
        'available': 'متاح',
        'in-use': 'مستخدم',
        'maintenance': 'تحت الصيانة',
        'defective': 'معطل'
    };
    statusSpan.textContent = statusTextMap[newStatus] || 'متاح';

    // تحديث لون الحالة
    const statusClassMap = {
        'available': 'bg-blue-100 text-blue-800',
        'in-use': 'bg-green-100 text-green-800',
        'maintenance': 'bg-yellow-100 text-yellow-800',
        'defective': 'bg-red-100 text-red-800'
    };
    statusSpan.className = `px-2 py-1 rounded-full text-xs ${statusClassMap[newStatus] || 'bg-gray-100 text-gray-800'}`;

    // تحديث المستخدم
    deviceRow.cells[5].textContent = newUser || '-';

    // إغلاق النافذة
    document.getElementById('editDeviceModal').classList.add('hidden');

    // عرض رسالة نجاح (يمكن استبدالها بـ Popup كما في المثال السابق)
    alert('تم تحديث بيانات الجهاز بنجاح');
});
const statusMap = {
    'مستخدم': 'in-use',
    'تحت الصيانة': 'maintenance'
};

const statusTextMap = {
    'in-use': 'مستخدم',
    'maintenance': 'تحت الصيانة'
};

const statusClassMap = {
    'in-use': 'bg-green-100 text-green-800',
    'maintenance': 'bg-yellow-100 text-yellow-800'
};
// دالة البحث في المخزون
function setupInventorySearch() {
    const searchInput = document.getElementById('inventory-search');
    const barcodeSearchBtn = document.getElementById('barcode-search-btn');

    if (searchInput) {
        searchInput.addEventListener('input', function () {
            const searchTerm = this.value.toLowerCase();
            const rows = document.querySelectorAll('#inventory-table-body tr');

            rows.forEach(row => {
                const employeeId = row.cells[5].textContent.toLowerCase();
                const serialNumber = row.cells[3].textContent.toLowerCase();

                if (employeeId.includes(searchTerm) || serialNumber.includes(searchTerm)) {
                    row.style.display = '';
                } else {
                    row.style.display = 'none';
                }
            });
        });
    }

    if (barcodeSearchBtn) {
        barcodeSearchBtn.addEventListener('click', function () {
            // التنقل إلى قسم الباركود
            document.querySelectorAll('.admin-nav-btn').forEach(btn => {
                btn.classList.remove('active', 'border-white');
                btn.classList.add('opacity-70', 'border-transparent');
            });

            document.querySelector('.admin-nav-btn[data-target="barcode"]').classList.add('active', 'border-white');
            document.querySelector('.admin-nav-btn[data-target="barcode"]').classList.remove('opacity-70', 'border-transparent');

            document.querySelectorAll('.admin-section').forEach(section => {
                section.classList.remove('active');
                section.classList.add('hidden');
            });

            document.getElementById('barcode-section').classList.add('active');
            document.getElementById('barcode-section').classList.remove('hidden');

            // بدء المسح تلقائياً
            if (typeof initScanner === 'function') {
                initScanner();
            }
        });
    }
}

// استدعاء الدالة عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
    setupInventorySearch();
});

let currentInventoryDeviceId = null;

// وظيفة لعرض نموذج تأكيد الجرد
function showInventoryConfirmModal(deviceId) {
    currentInventoryDeviceId = deviceId;
    document.getElementById('inventoryConfirmModal').classList.remove('hidden');
}

// وظيفة لإخفاء نموذج تأكيد الجرد
function hideInventoryConfirmModal() {
    document.getElementById('inventoryConfirmModal').classList.add('hidden');
}

// وظيفة لعرض نموذج نجاح الجرد
function showInventorySuccessModal() {
    document.getElementById('inventorySuccessModal').classList.remove('hidden');
}

// وظيفة لإخفاء نموذج نجاح الجرد
function hideInventorySuccessModal() {
    document.getElementById('inventorySuccessModal').classList.add('hidden');
}

// وظيفة لحذف الجهاز من الجدول
function removeDeviceFromInventory(deviceId) {
    const row = document.querySelector(`tr[data-device-id="${deviceId}"]`);
    if (row) {
        row.remove();
    }
}

// إضافة معالج الأحداث لأزرار الجرد
document.addEventListener('DOMContentLoaded', function () {
    // معالج النقر لأزرار الجرد
    document.addEventListener('click', function (e) {
        if (e.target.classList.contains('inventory-btn')) {
            const deviceId = e.target.closest('tr').getAttribute('data-device-id');
            showInventoryConfirmModal(deviceId);
        }
    });

    // معالج النقر لتأكيد الجرد
    document.getElementById('confirmInventory').addEventListener('click', function () {
        if (currentInventoryDeviceId) {
            removeDeviceFromInventory(currentInventoryDeviceId);
            hideInventoryConfirmModal();
            showInventorySuccessModal();
        }
    });

    // معالج النقر لإلغاء الجرد
    document.getElementById('cancelInventory').addEventListener('click', hideInventoryConfirmModal);
    document.getElementById('closeInventoryConfirmModal').addEventListener('click', hideInventoryConfirmModal);

    // معالج النقر لإغلاق نافذة نجاح الجرد
    document.getElementById('closeInventorySuccess').addEventListener('click', hideInventorySuccessModal);
    document.getElementById('inventorySuccessModal').addEventListener('click', function (e) {
        if (e.target === this) {
            hideInventorySuccessModal();
        }
    });
});

// Initialize charts when the page loads and when the reports section is shown
document.addEventListener('DOMContentLoaded', function () {
    // Create charts when the reports section becomes active
    const observer = new MutationObserver(function (mutations) {
        mutations.forEach(function (mutation) {
            if (mutation.attributeName === 'class') {
                const reportsSection = document.getElementById('reports-section');
                if (reportsSection.classList.contains('active')) {
                    initCharts();
                }
            }
        });
    });

    // Observe the reports section for class changes
    observer.observe(document.getElementById('reports-section'), {
        attributes: true
    });

    // Also initialize charts if the reports section is already active
    if (document.getElementById('reports-section').classList.contains('active')) {
        initCharts();
    }
});

function initCharts() {
    // Device Status Chart
    const statusCtx = document.getElementById('deviceStatusChart').getContext('2d');
    if (window.deviceStatusChart) {
        window.deviceStatusChart.destroy();
    }
    window.deviceStatusChart = new Chart(statusCtx, {
        type: 'doughnut',
        data: {
            labels: ['مستخدم', 'متاح', 'تحت الصيانة', 'معطل'],
            datasets: [{
                data: [98, 14, 12, 5],
                backgroundColor: [
                    '#10B981', // Green for used
                    '#3B82F6', // Blue for available
                    '#F59E0B', // Yellow for maintenance
                    '#EF4444'  // Red for defective
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    rtl: true,
                    labels: {
                        usePointStyle: true,
                        padding: 20,
                        font: {
                            family: 'Tajawal, sans-serif'
                        }
                    }
                }
            },
            cutout: '70%'
        }
    });

    // Device Type Distribution Chart
    const typeCtx = document.getElementById('deviceTypeChart').getContext('2d');
    if (window.deviceTypeChart) {
        window.deviceTypeChart.destroy();
    }
    window.deviceTypeChart = new Chart(typeCtx, {
        type: 'bar',
        data: {
            labels: ['لابتوب', 'جهاز مكتبي', 'طابعة', 'شاشة', 'أخرى'],
            datasets: [{
                label: 'عدد الأجهزة',
                data: [48, 38, 25, 13, 5],
                backgroundColor: '#8B5CF6', // Purple from your color scheme
                borderColor: '#7C3AED',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 10
                    }
                }
            },
            indexAxis: 'y' // Horizontal bars
        }
    });
}

