import axios from 'axios';
import onChange from 'on-change';

export default () => {
  const validateName = (name) => (name.trim().length ? [] : ['name cannot be empty']);
  const validateEmail = (email) => (/\w+@\w+/.test(email) ? [] : ['invalid email']);
  const validateField = (fieldname, data) => (fieldname === 'name' ? validateName(data) : validateEmail(data));

  const state = {
    values: {
      name: '',
      email: '',
    },
    errors: {
      name: [],
      email: [],
    },
  };

  const fromContainer = document.querySelector('.form-container');

  const fromHTML = `
    <form id="registrationForm">
        <div class="form-group">
            <label for="inputName">Name</label>
            <input type="text" class="form-control" id="inputName" placeholder="Введите ваше имя" name="name" required>
        </div>
        <div class="form-group">
            <label for="inputEmail">Email</label>
            <input type="text" class="form-control" id="inputEmail" placeholder="Введите email" name="email" required>
        </div>
        <input type="submit" value="Submit" class="btn btn-primary">
    </form>
    `;
  fromContainer.innerHTML = fromHTML;

  const form = document.querySelector('form');
  const sumbit = document.querySelector('[type="submit"]');

  const watchState = onChange(state, (path) => {
    const selector = path.split('.')[1];
    const input = document.querySelector(`[name=${selector}]`);
    if (validateField(selector, state.values[selector]).length === 0) {
      input.classList.remove('is-invalid');
      input.classList.add('is-valid');
    } else {
      input.classList.remove('is-valid');
      input.classList.add('is-invalid');
    }

    sumbit.disabled = state.errors.name.length !== 0 || state.errors.email.length !== 0;
  });

  form.addEventListener('input', (e) => {
    e.preventDefault();
    const targetName = e.target.name;
    const data = new FormData(form).get(targetName);
    watchState.values[targetName] = data;
    watchState.errors[targetName] = validateField(targetName, data);
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    axios.post('/users', state.values)
      .then((resp) => {
        document.body.innerHTML = `<p>${resp.data.message}</p>`;
      })
      .catch((error) => {
        console.log(error);
      });
  });
};
