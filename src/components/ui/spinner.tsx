import { RotatingLines } from "react-loader-spinner";

type SpinnerProps = {
    loading: boolean;
    errMsg?: string;
};

export function Spinner({ loading, errMsg }: SpinnerProps) {
    if (!loading && !errMsg) return null;

    return (
        <div className={'absolute top-1/2 left-1/2'}>
            {loading && (
                <RotatingLines visible={true} width={'30px'} strokeColor={'#203154'} />
            )}
            {errMsg && <div>{errMsg}</div>}
        </div>
    );
}
