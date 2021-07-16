const sanitizeId = (str) => 
  encodeURIComponent(str)
    .toLowerCase()
    .replace(/\.|%[0-9a-z]{2}/gi, '');

export default sanitizeId;
