const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const isValidEmail = (email) => emailRegex.test(email);

const splitEmail = (email) => {
  const normalized = String(email || "").trim().toLowerCase();
  const [localPart = "", domain = ""] = normalized.split("@");
  return { normalized, localPart, domain };
};

const isAllowedDomain = (email, allowedDomains = []) => {
  const { domain } = splitEmail(email);
  return allowedDomains.includes(domain);
};

const inferAcademicRole = (email) => {
  const { localPart } = splitEmail(email);

  if (localPart.includes("student")) {
    return "student";
  }

  if (localPart.includes("faculty")) {
    return "faculty";
  }

  return "alumni";
};

module.exports = {
  isValidEmail,
  splitEmail,
  isAllowedDomain,
  inferAcademicRole,
};
