import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { useSelector, useDispatch } from 'react-redux';
import { history } from '_helpers';
import { taskActions, alertActions } from '_store';

export { AddEdit };

function AddEdit() {
    const { id } = useParams();
    const [title, setTitle] = useState();
    const dispatch = useDispatch();
    const task = useSelector(x => x.tasks?.item);
    console.log(task)
    const validationSchema = Yup.object().shape({
        name: Yup.string()
            .required('Nombre es requerido'),
        description: Yup.string()
            .required('Apellido es requerido'),
        status: Yup.string()
            .required('Estatus es requerido')
    });
    const formOptions = { resolver: yupResolver(validationSchema) };
    const { register, handleSubmit, reset, formState } = useForm(formOptions);
    const { errors, isSubmitting } = formState;

    useEffect(() => {
        if (id) {
            setTitle('Editar Tarea');
            dispatch(taskActions.getById(id)).unwrap()
                .then(task => reset(task?.data?.task));
        } else {
            setTitle('Agregar Tarea');
        }
    }, []);

    async function onSubmit(data) {
        dispatch(alertActions.clear());
        try {
            let message;
            if (id) {
                await dispatch(taskActions.update({ id, data })).unwrap();
                message = 'Tarea actualizada';
            } else {
                await dispatch(taskActions.register(data)).unwrap();
                message = 'Tarea agregada';
            }
            history.navigate('/');
            dispatch(alertActions.success({ message, showAfterRedirect: true }));
        } catch (error) {
            dispatch(alertActions.error(error));
        }
    }

    return (
        <>
            <h1>{title}</h1>
            {!(task?.loading || task?.error) &&
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="row">
                        <div className="mb-3 col">
                            <label className="form-label">Nombre</label>
                            <input name="name" type="text" {...register('name')} className={`form-control ${errors.name ? 'is-invalid' : ''}`} />
                            <div className="invalid-feedback">{errors.name?.message}</div>
                        </div>

                        <div className="mb-3 col">
                            <label className="form-label">Estatus</label>
                            <select name="status" id="" {...register('status')} className={`form-control ${errors.status ? 'is-invalid' : ''}`}>
                                <option value="backlog">backlog</option>
                                <option value="in process">in process</option>
                                <option value="finished">finished</option>
                            </select>
                            
                            <div className="invalid-feedback">{errors.status?.message}</div>
                        </div>
                    </div>
                    <div className="row">
                    <div className="mb-3 col">
                            <label className="form-label">Descripcion</label>
                            <input name="description" type="text" {...register('description')} className={`form-control ${errors.description ? 'is-invalid' : ''}`} />
                            <div className="invalid-feedback">{errors.description?.message}</div>
                        </div>
                    </div>
                    <div className="mb-3">
                        <button type="submit" disabled={isSubmitting} className="btn btn-primary me-2">
                            {isSubmitting && <span className="spinner-border spinner-border-sm me-1"></span>}
                            Save
                        </button>
                        <button onClick={() => reset()} type="button" disabled={isSubmitting} className="btn btn-secondary">Reset</button>
                        <Link to="/" className="btn btn-link">Cancel</Link>
                    </div>
                </form>
            }
            {task?.loading &&
                <div className="text-center m-5">
                    <span className="spinner-border spinner-border-lg align-center"></span>
                </div>
            }
            {task?.error &&
                <div class="text-center m-5">
                    <div class="text-danger">Error loading task: {task.error}</div>
                </div>
            }
        </>
    );
}
