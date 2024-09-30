import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Module } from '@/types/bestLineup'

interface ModuleSelectorProps {
	modules: Module[]
	selectedModule: string | null
	onModuleChange: (moduleType: string) => void
}

export function ModuleSelector({ modules, selectedModule, onModuleChange }: ModuleSelectorProps) {
	return (
		<Card className="bg-gray-800/50 border-emerald-500/30 backdrop-blur-sm">
			<CardHeader>
				<CardTitle className="text-xl font-bold text-emerald-400">Formation Modules</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-2 gap-4">
					{modules.map((module) => (
						<button
							key={module.module}
							onClick={() => onModuleChange(module.module)}
							className={`p-4 rounded-lg text-left transition-colors ${selectedModule === module.module
								? 'bg-emerald-700/50'
								: 'bg-gray-700/30'
								} hover:bg-emerald-600/30 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-opacity-50`}
						>
							<div className="flex justify-between items-center mb-2">
								<span className="text-lg font-semibold text-white flex items-center justify-center">
									{module.module}
									{module.adviced && <span className="ml-1 text-xs">👑</span>}
								</span>
								<span className="text-lg text-emerald-400 font-medium">
									Score: {module.fm.toFixed(2)}
								</span>
							</div>
							<div className="grid grid-cols-2 gap-x-4 text-xs text-gray-300">
								<p>Best: {module.bestPercentage.toFixed(2)}%</p>
								<p>Less: {module.lessPercentage.toFixed(2)}%</p>
								<p>Def Mod: {module.modificatoreDifesa.toFixed(2)}</p>
							</div>
						</button>
					))}
				</div>
			</CardContent>
		</Card>
	)
}