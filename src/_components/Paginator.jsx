export { Paginator };

function Paginator({
    currentPage,
    setCurrentPage,
    totalPages
}) {
    if (totalPages <= 1) {
        return null;
    }

    const extraBtn=(Number,label)=>{
        if (totalPages>5) {
            return (
                <td key={label} >
                    <button
                        type="button"
                        className="btn btn-default"
                        onClick={() => setCurrentPage(Number)}
                    >
                        {label}
                    </button>
                </td>
            );
        }
    }

    const generatePageNumbers = () => {
        const pagesToShow = 5;
        const halfToShow = Math.floor(pagesToShow / 2);

        let startPage = currentPage - halfToShow;
        let endPage = currentPage + halfToShow;

        if (startPage < 1) {
            startPage = 1;
            endPage = Math.min(totalPages, pagesToShow);
        }
        if (endPage > totalPages) {
            endPage = totalPages;
            startPage = Math.max(1, totalPages - pagesToShow + 1);
        }
        
        const pageButtons = [];
       
        for (let i = startPage; i <= endPage; i++) {
            pageButtons.push(
                <td key={i}>
                    <button
                        type="button"
                        className={`btn btn-${i === currentPage ? 'primary' : 'default'}`}
                        onClick={() => setCurrentPage(i)}
                    >
                        {i}
                    </button>
                </td>
            );
        }

        return pageButtons;
    };

   
    return (
        <table>
            <tbody>
                <tr>
                    {extraBtn(1,"Inicio")}
                    {generatePageNumbers()}
                    {extraBtn(totalPages,"Final")}
                </tr>
            </tbody>
        </table>
        
    );
   
}