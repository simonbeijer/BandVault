const isDev = process.env.NODE_ENV === 'development';
export const devLog = (...args: any[]) => {
  if (isDev) {

    const timeStamp = new Date().toISOString();
    const stack = new Error().stack?.split("\n")[2]?.trim();

    console.log(`[${timeStamp}][${stack}]`, ...args);
  }
};
