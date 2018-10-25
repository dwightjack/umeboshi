// require.context('@/pages/', true, /\.s?css$/).keys()

export default (importFn) => (pages) => {
    const styles = {};
    pages.forEach((page) => {
        styles[page] = importFn(page);
    });
};
