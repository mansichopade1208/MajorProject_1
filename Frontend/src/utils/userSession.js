
export function getLoggedInUser() {
  try {
    const user = sessionStorage.getItem("medikioskUser");

    return user ? JSON.parse(user) : null;
  } catch (error) {
    console.error("Unable to retrieve user session:", error);
    return null;
  }
}

export function getUserInitials(fullName = "") {
  return fullName
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0].toUpperCase())
    .join("");
}
