document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('feedbackForm');
    const successMessage = document.getElementById('form-message-success');
    const warningMessage = document.getElementById('form-message-warning');

    form.addEventListener('submit', async function(event) {
        event.preventDefault();

        const formData = new FormData(form);
        const data = {
            fname: formData.get('fname'),
            lname: formData.get('lname'),
            email: formData.get('email'),
            message: formData.get('message')
        };

        // Frontend validation
        if (!data.fname || !data.lname || !data.email || !data.message) {
            console.log('warning: All fields are required!');
            warningMessage.textContent = 'All fields are required!';
            warningMessage.style.display = 'block';
            successMessage.style.display = 'none';
            return;
        }

        try {
            const response = await fetch('http://localhost:3000/api/feedback', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            const responseData = await response.json();
            console.log('Success:', responseData);
            successMessage.style.display = 'block';
            warningMessage.style.display = 'none';

            // Clear the form fields
            form.reset();
        } catch (error) {
            console.error('Error:', error);
            warningMessage.textContent = 'There was an error sending your message.';
            warningMessage.style.display = 'block';
            successMessage.style.display = 'none';
        }
    });
});
