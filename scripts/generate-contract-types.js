// Generates ethers-v6 typechain wrappers for the Cartesi contracts consumed by
// the app. The published @cartesi/* packages ship ethers-v5 typechain wrappers,
// which are incompatible with ethers v6, so we regenerate v6 wrappers from the
// ABIs those packages export.
//
// Run with: yarn contracts:types

const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const root = path.resolve(__dirname, '..');
const tmpDir = path.join(root, '.abis');
const tmpDirV1 = path.join(root, '.abis-pos-1.0');

const req = (p) => require(require.resolve(p, { paths: [root] }));

// typeName -> abi source. Prefer hardhat artifacts (named correctly); fall back
// to the deployment export files (shape: { contracts: { name: { abi } } }).
const fromArtifact = (pkg, relPath) => req(`${pkg}/export/artifacts/${relPath}`).abi;
const fromExport = (pkg, network, name) =>
    req(`${pkg}/export/abi/${network}.json`).contracts[name].abi;

const contracts = {
    // @cartesi/pos
    PoS: fromArtifact('@cartesi/pos', 'contracts/PoS.sol/PoS.json'),
    Staking: fromArtifact('@cartesi/pos', 'contracts/Staking.sol/Staking.json'),
    StakingImpl: fromArtifact(
        '@cartesi/pos',
        'contracts/StakingImpl.sol/StakingImpl.json'
    ),
    // WorkerManagerAuthManagerImpl artifact is not shipped; use the ABI export.
    WorkerManagerAuthManagerImpl: fromExport(
        '@cartesi/pos',
        'mainnet',
        'WorkerManagerAuthManagerImpl'
    ),
    // @cartesi/token
    CartesiToken: fromArtifact(
        '@cartesi/token',
        'contracts/CartesiToken.sol/CartesiToken.json'
    ),
    SimpleFaucet: fromArtifact(
        '@cartesi/token',
        'contracts/SimpleFaucet.sol/SimpleFaucet.json'
    ),
    // @cartesi/staking-pool
    StakingPoolImpl: fromArtifact(
        '@cartesi/staking-pool',
        'contracts/StakingPoolImpl.sol/StakingPoolImpl.json'
    ),
    Fee: fromArtifact(
        '@cartesi/staking-pool',
        'contracts/interfaces/Fee.sol/Fee.json'
    ),
    StakingPoolFactoryImpl: fromArtifact(
        '@cartesi/staking-pool',
        'contracts/StakingPoolFactoryImpl.sol/StakingPoolFactoryImpl.json'
    ),
    FlatRateCommission: fromArtifact(
        '@cartesi/staking-pool',
        'contracts/FlatRateCommission.sol/FlatRateCommission.json'
    ),
    GasTaxCommission: fromArtifact(
        '@cartesi/staking-pool',
        'contracts/GasTaxCommission.sol/GasTaxCommission.json'
    ),
};

// @cartesi/pos-1.0 ships a legacy PoS contract with the same type name, so it is
// generated into its own directory to avoid a name collision with the v2 PoS.
const contractsV1 = {
    PoS: fromArtifact('@cartesi/pos-1.0', 'PoS.json'),
};

const writeAbis = (dir, map) => {
    fs.rmSync(dir, { recursive: true, force: true });
    fs.mkdirSync(dir, { recursive: true });
    for (const [name, abi] of Object.entries(map)) {
        fs.writeFileSync(
            path.join(dir, `${name}.json`),
            JSON.stringify(abi, null, 2)
        );
    }
};

const runTypechain = (globPattern, outDir) => {
    fs.rmSync(path.join(root, outDir), { recursive: true, force: true });
    execFileSync(
        'yarn',
        [
            'typechain',
            '--target',
            'ethers-v6',
            '--out-dir',
            outDir,
            globPattern,
        ],
        { cwd: root, stdio: 'inherit' }
    );
};

writeAbis(tmpDir, contracts);
writeAbis(tmpDirV1, contractsV1);

runTypechain('.abis/*.json', 'src/contracts/types');
runTypechain('.abis-pos-1.0/*.json', 'src/contracts/types-pos-1.0');

fs.rmSync(tmpDir, { recursive: true, force: true });
fs.rmSync(tmpDirV1, { recursive: true, force: true });

console.log('Generated ethers-v6 contract types.');
