import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpinner } from '@fortawesome/free-solid-svg-icons'

interface ButtonProps {
  icon?: any;
  text?: string;
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
}

export default function Button({ icon, text, onClick, disabled = false, loading = false }: ButtonProps) {
  return (
    <button
    className="py-2 px-3 rounded-xl border"
    onClick={onClick}
    disabled={disabled || loading}
    >
      {loading ? 
        <FontAwesomeIcon icon={faSpinner} className="animate-spin" /> :
        <><FontAwesomeIcon icon={icon} /> {text}</>
      }
    </button>
  );
}
