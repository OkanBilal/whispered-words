const Fetcher = (url) => fetch(url).then((res) => res.json());

export default Fetcher;
