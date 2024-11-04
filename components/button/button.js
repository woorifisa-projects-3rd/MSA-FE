import classes from './button.module.css';

export default function Button({ text, color }) {
    const buttonStyle = {
        backgroundColor: color,
    };

    return (
        <button className={classes.button} style={buttonStyle}>
            {text}
        </button>
    );
}