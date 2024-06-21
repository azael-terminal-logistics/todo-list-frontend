import { Link } from 'react-router-dom';
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { useDispatch } from 'react-redux';

import { history } from '_helpers';
import { authActions, alertActions } from '_store';

export { Register };

function Register() {
    const dispatch = useDispatch();

    const validationSchema = Yup.object().shape({
        firstName: Yup.string()
            .required('Nombre es requerido'),
        lastName: Yup.string()
            .required('Apellido es requerido'),
        email: Yup.string().email()
            .required('Email es requerido'),
        password: Yup
        .string()
        .required("Contraseña es requerido")
        .matches(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
            "Debe contener almenos 4 acaracteres: una mayuscula, una minuscula, un numero y un simbolo especial"
        ),
        password_confirmation: Yup.string().oneOf([Yup.ref('password'), null], 'Debe ser igual a la contraseña')
    });
    const formOptions = { resolver: yupResolver(validationSchema) };
    const { register, handleSubmit, formState } = useForm(formOptions);
    const { errors, isSubmitting } = formState;

    async function onSubmit(data) {
        dispatch(alertActions.clear());
        try {
            await dispatch(authActions.register(data)).unwrap();
            history.navigate('/account/login');
            dispatch(alertActions.success({ message: 'Registration successful', showAfterRedirect: true }));
        } catch (error) {
            dispatch(alertActions.error(error));
        }
    }

    return (
        <div className="card m-3">
            <h4 className="card-header">Registro</h4>
            <div className="card-body">
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="mb-3">
                        <label className="form-label">Nombre</label>
                        <input name="firstName" type="text" {...register('firstName')} className={`form-control ${errors.firstName ? 'is-invalid' : ''}`} />
                        <div className="invalid-feedback">{errors.firstName?.message}</div>
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Apellido</label>
                        <input name="lastName" type="text" {...register('lastName')} className={`form-control ${errors.lastName ? 'is-invalid' : ''}`} />
                        <div className="invalid-feedback">{errors.lastName?.message}</div>
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Email</label>
                        <input name="email" type="text" {...register('email')} className={`form-control ${errors.email ? 'is-invalid' : ''}`} />
                        <div className="invalid-feedback">{errors.email?.message}</div>
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Contraseña</label>
                        <input name="password" type="password" {...register('password')} className={`form-control ${errors.password ? 'is-invalid' : ''}`} />
                        <div className="invalid-feedback">{errors.password?.message}</div>
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Confirmar contraseña</label>
                        <input name="password_confirmation" type="password" {...register('password_confirmation')} className={`form-control ${errors.password_confirmation ? 'is-invalid' : ''}`} />
                        <div className="invalid-feedback">{errors.password_confirmation?.message}</div>
                    </div>
                    <button disabled={isSubmitting} className="btn btn-primary">
                        {isSubmitting && <span className="spinner-border spinner-border-sm me-1"></span>}
                        Guardar
                    </button>
                    <Link to="../login" className="btn btn-link">Cancelar</Link>
                </form>
            </div>
        </div>
    )
}
