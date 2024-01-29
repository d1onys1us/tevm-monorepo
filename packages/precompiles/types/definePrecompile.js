import { Precompile } from './Precompile.js';
export const definePrecompile = ({ contract, call, }) => {
    class PrecompileImplementation extends Precompile {
        contract = contract;
        call = call;
    }
    return new PrecompileImplementation();
};
