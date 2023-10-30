module.exports = {
  WEB: {
    title: "Hotel Management System",
    login: {
      title: "Login - " + "Hotel Management System",
    },
    dashboard: {
        title: "Dashboard - " + "Hotel Management System",
    },
    today: new Date().toLocaleString('en-US', { timeZone : 'Asia/Bangkok'}).slice(0,9)
  },
  DB: {
    host: "localhost",
    user: "root",
    password: "root",
    database: "hotel_property_management",
  },
};
