import classes from './TestButton.module.css';

export default function TestButton({ text, color }) {
    const buttonStyle = {
        backgroundColor: color,
    };

    return (
        <button className={classes.button} style={buttonStyle}>
            {text}
        </button>
    );
}