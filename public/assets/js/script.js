document.addEventListener('DOMContentLoaded', function () {
    const table = document.querySelector('.datatable');

    table.addEventListener('click', function (event) {
        const row = event.target.closest('tr');
        if (row) {
            remove2light(table);
            // Thêm class highlight
            row.classList.add('highlight');

            document.getElementById('viewEmployeeButton').disabled = false;
        }
    });

    document.getElementById('refreshButton').addEventListener('click', function () {
        remove2light(table);
    });
    document.getElementById('viewEmployeeButton').addEventListener('click', function () {
        // remove2light(table);
    });
});

function remove2light(table) {
    // Xóa hết highlight
    const rows = table.querySelectorAll('tbody tr');
    rows.forEach(r => r.classList.remove('highlight'));
    document.getElementById('viewEmployeeButton').disabled = true;
}


