import classes from './button.module.css';

export default function Button({ text, color, onClick }) {
    const buttonStyle = {
        backgroundColor: color,
    };

    return (
        <button className={classes.button} style={buttonStyle} onClick={onClick}>
            {text}
        </button>
    );
}