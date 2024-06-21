import { useEffect,useState  } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Paginator} from '_components';

import { taskActions } from '_store';

export { List };

function List() {
    const tasks = useSelector(x => x.tasks.list);
    const [limitPerPage, setLimitPerPage] = useState(5)
    const [currentPage, setCurrentPage] = useState(1)

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(taskActions.getAll({currentPage:currentPage,limitPerPage:limitPerPage}));
    }, [limitPerPage,currentPage]);

    return (
        <div>
            <h1>Tareas</h1>
            <Link to="add" className="btn btn-sm btn-success mb-2">Agregar tarea</Link>
            <div className='container'>
                <div className='row'>
                    <dir className="col-sm-12 col-md-10">
                    <Paginator currentPage={currentPage} totalPages={tasks?.value?.data?.totalPages} setCurrentPage={setCurrentPage}/>
                    </dir>
                    <dir className="col-sm-12 col-md-2">
                        <label htmlFor="">Registros</label>
                        <select className="form-select" value={limitPerPage} onChange={(e)=>{setLimitPerPage(e.target.value);}}>
                            <option value="5">5</option>
                            <option value="10">10</option>
                            <option value="20">20</option>
                            <option value="30">30</option>
                        </select>
                    </dir>
                </div>
            </div>

            <table className="table table-striped">
                <thead>
                    <tr>
                        <th style={{ width: '30%' }}>Nombre</th>
                        <th style={{ width: '30%' }}>Descripcion</th>
                        <th style={{ width: '30%' }}>Estatus</th>
                        <th style={{ width: '10%' }}></th>
                    </tr>
                </thead>
                <tbody>
                    {tasks?.value?.data?.tasks?.map(task =>
                        <tr key={task.id}>
                            <td>{task.name}</td>
                            <td>{task.description}</td>
                            <td>{task.status}</td>
                            <td style={{ whiteSpace: 'nowrap' }}>
                                <Link to={`edit/${task.id}`} className="btn btn-sm btn-primary me-1">Edit</Link>
                                <button onClick={() => dispatch(taskActions.delete(task.id))} className="btn btn-sm btn-danger" style={{ width: '60px' }} disabled={task.isDeleting}>
                                    {task.isDeleting 
                                        ? <span className="spinner-border spinner-border-sm"></span>
                                        : <span>Delete</span>
                                    }
                                </button>
                            </td>
                        </tr>
                    )}
                    {tasks?.loading &&
                        <tr>
                            <td colSpan="4" className="text-center">
                                <span className="spinner-border spinner-border-lg align-center"></span>
                            </td>
                        </tr>
                    }
                </tbody>
            </table>
        </div>
    );
}
