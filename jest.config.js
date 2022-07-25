module.exports = {
	collectCoverage: true,
	collectCoverageFrom: ['src/**/*.ts'],
	preset: 'ts-jest',
	testEnvironment: 'node',
	moduleDirectories: ['node_modules', 'src'],
	modulePathIgnorePatterns: ['./build/'],
};
