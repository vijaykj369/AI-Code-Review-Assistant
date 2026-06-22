import { useState } from 'react'

function FileIcon({ type }) {
  if (type === 'dir') return <span className="text-accent text-xs">📁</span>
  return <span className="text-gray-500 text-xs">📄</span>
}

function TreeNode({ node, depth = 0, onSelect, selected }) {
  const [open, setOpen] = useState(depth < 2)
  const isDir = node.type === 'dir'

  return (
    <div>
      <div
        className={`flex items-center gap-1.5 px-2 py-1 rounded cursor-pointer text-sm transition-colors ${
          selected === node.path ? 'bg-accent/10 text-accent' : 'text-gray-400 hover:bg-dark-hover hover:text-gray-200'
        }`}
        style={{ paddingLeft: `${8 + depth * 16}px` }}
        onClick={() => isDir ? setOpen(!open) : onSelect(node)}
      >
        {isDir && <span className="text-gray-600 text-xs">{open ? '▾' : '▸'}</span>}
        <FileIcon type={node.type} />
        <span className="font-mono text-xs">{node.name}</span>
      </div>
      {isDir && open && node.children?.map((child) => (
        <TreeNode key={child.path} node={child} depth={depth + 1} onSelect={onSelect} selected={selected} />
      ))}
    </div>
  )
}

export default function RepoFileTree({ tree, onFileSelect }) {
  const [selected, setSelected] = useState(null)

  const handleSelect = (node) => {
    setSelected(node.path)
    onFileSelect?.(node)
  }

  if (!tree?.length) return (
    <div className="text-center py-8 text-sm text-gray-600">No files to display</div>
  )

  return (
    <div className="bg-dark-surface border border-dark-border rounded-xl overflow-hidden">
      <div className="px-4 py-3 border-b border-dark-border">
        <p className="text-xs font-medium text-gray-400">Repository files</p>
      </div>
      <div className="py-2 max-h-96 overflow-y-auto">
        {tree.map((node) => (
          <TreeNode key={node.path} node={node} onSelect={handleSelect} selected={selected} />
        ))}
      </div>
    </div>
  )
}