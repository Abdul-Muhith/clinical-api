const generateTraceId = (code = ``) => {
  const digits = "0123456789";

  // Generate 10 random digits
  const randomDigits = Array.from({ length: 10 }, () =>
    digits.charAt(Math.floor(Math.random() * digits.length))
  ).join("");

  // Create and return the trace ID by combining the parts
  return `${code}-${randomDigits}`;
};

export default generateTraceId;
