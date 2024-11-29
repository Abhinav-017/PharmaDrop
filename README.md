# PharmaDrop

PharmaDrop is a modern web application for online medicine delivery. It provides a convenient platform for users to browse, order, and receive medications from the comfort of their homes.

## Features

- User authentication (login/register)
- Browse available medicines
- Shopping cart functionality
- Secure payment processing
- Order tracking and history
- Responsive design for all devices

## Tech Stack

- React.js for the frontend
- Context API for state management
- React Router for navigation
- Axios for API requests
- CSS for styling

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   cd pharmadrop-app
   npm install
   ```
3. Start the development server:
   ```bash
   npm start
   ```

## Project Structure

```
pharmadrop-app/
├── public/
│   ├── images/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── Cart.js
│   │   ├── Dashboard.js
│   │   ├── Footer.js
│   │   ├── Header.js
│   │   ├── Login.js
│   │   ├── MedicineList.js
│   │   ├── OrderSummary.js
│   │   ├── PaymentForm.js
│   │   └── Register.js
│   ├── context/
│   │   ├── AuthContext.js
│   │   └── CartContext.js
│   ├── config/
│   │   └── axios.js
│   ├── utils/
│   │   └── currency.js
│   ├── App.js
│   └── index.js
└── package.json
```

## Environment Variables

Create a `.env` file in the project root with the following variables:
```
REACT_APP_API_URL=your_api_url
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request
