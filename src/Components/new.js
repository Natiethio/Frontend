const getConfig = async () => {
  const response = await fetch('/config.json');
  const config = await response.json();
  return config;
};

const config = await getConfig();
const response = await fetch(`${config.API_BASE_URL}/Productlist`, {
   headers: {
      'Authorization': `Bearer ${token}`,
   },
});