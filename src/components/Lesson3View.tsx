import React, { useMemo, useState } from 'react';
import {
  Folder,
  FolderOpen,
  FolderPlus,
  FilePlus,
  FileText,
  FileImage,
  Presentation,
  Pencil,
  Copy,
  MoveRight,
  ClipboardPaste,
  Trash2,
  Search,
  RotateCcw,
  ChevronRight,
  ChevronDown,
  ArrowUp,
  CheckCircle2,
  Circle,
  ArrowRight,
  X,
  Eye,
} from 'lucide-react';
import { AppProgress, FileKind, FSNode } from '../types';
import {
  INITIAL_FS_NODES,
  LESSON3_MISSIONS,
  ROOT_FOLDER_ID,
} from '../data/lesson3Data';
import {
  evaluateLesson3Missions,
  validateFileSystemName,
} from '../utils/storage';
import { RoboAssistant, RoboMood } from './RoboAssistant';
import { playTone } from '../utils/sound';

interface Lesson3ViewProps {
  progress: AppProgress['lesson3'];
  soundEnabled: boolean;
  onUpdate: (next: AppProgress['lesson3']) => void;
  onGoArena: () => void;
}

type ModalMode =
  | null
  | { type: 'new-folder' }
  | { type: 'new-file' }
  | { type: 'rename'; node: FSNode }
  | { type: 'move'; node: FSNode }
  | { type: 'copy-to'; node: FSNode }
  | { type: 'delete'; node: FSNode }
  | { type: 'preview'; node: FSNode };

export const Lesson3View: React.FC<Lesson3ViewProps> = ({
  progress,
  soundEnabled,
  onUpdate,
  onGoArena,
}) => {
  const [nodes, setNodes] = useState<FSNode[]>(progress.nodes);
  const [currentFolderId, setCurrentFolderId] = useState<string>(ROOT_FOLDER_ID);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [expandedIds, setExpandedIds] = useState<Record<string, boolean>>({
    [ROOT_FOLDER_ID]: true,
  });

  // Search & Clipboard
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [clipboard, setClipboard] = useState<{
    nodeId: string;
    mode: 'copy' | 'cut';
  } | null>(null);

  // Dialog & feedback
  const [modal, setModal] = useState<ModalMode>(null);
  const [inputName, setInputName] = useState<string>('');
  const [newFileKind, setNewFileKind] = useState<FileKind>('docx');
  const [targetFolderId, setTargetFolderId] = useState<string>(ROOT_FOLDER_ID);
  const [modalError, setModalError] = useState<string | null>(null);

  const [roboMsg, setRoboMsg] = useState<string>(
    'Chào mừng em đến với Nhà kho dữ liệu thông minh! Em hãy thực hành 5 nhiệm vụ bên phải bằng các nút công cụ phía trên trình quản lí tệp nhé.'
  );
  const [roboMood, setRoboMood] = useState<RoboMood>('guide');

  const commitState = (
    nextNodes: FSNode[],
    nextSearchedTarget = progress.searchedTarget
  ) => {
    const missions = evaluateLesson3Missions(nextNodes, nextSearchedTarget);
    const allDone =
      missions.mission1 &&
      missions.mission2 &&
      missions.mission3 &&
      missions.mission4 &&
      missions.mission5;

    setNodes(nextNodes);
    onUpdate({
      nodes: nextNodes,
      searchedTarget: nextSearchedTarget,
      missions,
      completed: allDone,
    });
  };

  // Helpers
  const getNodePath = (nodeId: string | null, nodeList: FSNode[] = nodes): FSNode[] => {
    const chain: FSNode[] = [];
    let cursor = nodeList.find((n) => n.id === nodeId);
    while (cursor) {
      chain.unshift(cursor);
      cursor = cursor.parentId
        ? nodeList.find((n) => n.id === cursor!.parentId)
        : undefined;
    }
    return chain;
  };

  const getPathString = (nodeId: string | null) =>
    getNodePath(nodeId)
      .map((n) => n.name)
      .join(' / ');

  const currentFolder = nodes.find((n) => n.id === currentFolderId) || nodes[0];
  const selectedNode = nodes.find((n) => n.id === selectedNodeId) || null;
  const allFolders = useMemo(
    () => nodes.filter((n) => n.type === 'folder'),
    [nodes]
  );

  const currentItems = useMemo(() => {
    const children = nodes.filter((n) => n.parentId === currentFolderId);
    return [...children].sort((a, b) => {
      if (a.type !== b.type) return a.type === 'folder' ? -1 : 1;
      return a.name.localeCompare(b.name, 'vi');
    });
  }, [nodes, currentFolderId]);

  const searchResults = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return [];
    return nodes.filter((n) => n.name.toLowerCase().includes(q));
  }, [nodes, searchQuery]);

  const isSearching = searchQuery.trim().length > 0;

  const missionsDoneCount = Object.values(progress.missions).filter(Boolean).length;
  const progressPercent = missionsDoneCount * 20;

  // Detect search for Mission 5 ("baitap_toan.docx")
  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    const q = value.trim().toLowerCase();
    const matchedTarget =
      q.startsWith('baitap_toan') &&
      'baitap_toan.docx'.includes(q) &&
      nodes.some((n) => n.type === 'file' && n.name === 'baitap_toan.docx');

    if (matchedTarget && !progress.searchedTarget) {
      playTone('success', soundEnabled);
      setRoboMood('success');
      setRoboMsg('Chính xác! Em đã tìm thấy tệp baitap_toan.docx và hoàn thành Nhiệm vụ 5!');
      commitState(nodes, true);
    }
  };

  // Actions
  const openNewFolderModal = () => {
    setInputName('');
    setModalError(null);
    setModal({ type: 'new-folder' });
  };

  const openNewFileModal = () => {
    setInputName('');
    setNewFileKind('docx');
    setModalError(null);
    setModal({ type: 'new-file' });
  };

  const openRenameModal = (node: FSNode) => {
    setInputName(node.name);
    setModalError(null);
    setModal({ type: 'rename', node });
  };

  const openMoveModal = (node: FSNode) => {
    setTargetFolderId(currentFolderId);
    setModalError(null);
    setModal({ type: 'move', node });
  };

  const openCopyToModal = (node: FSNode) => {
    setTargetFolderId(currentFolderId);
    setModalError(null);
    setModal({ type: 'copy-to', node });
  };

  const openDeleteModal = (node: FSNode) => {
    if (node.id === ROOT_FOLDER_ID) {
      setRoboMood('encourage');
      setRoboMsg('Không thể xóa thư mục gốc HOC_TAP nhé em!');
      return;
    }
    setModalError(null);
    setModal({ type: 'delete', node });
  };

  const handleCreateFolder = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = inputName.trim();
    const check = validateFileSystemName(trimmed);
    if (!check.valid) {
      setModalError(check.error || 'Tên thư mục không hợp lệ.');
      return;
    }
    const duplicate = nodes.some(
      (n) =>
        n.parentId === currentFolderId &&
        n.name.toLowerCase() === trimmed.toLowerCase()
    );
    if (duplicate) {
      setModalError(`Đã có mục tên "${trimmed}" trong thư mục này.`);
      return;
    }

    const newFolder: FSNode = {
      id: `folder-${Date.now()}`,
      name: trimmed,
      type: 'folder',
      parentId: currentFolderId,
      modifiedLabel: 'Vừa xong',
    };
    const nextNodes = [...nodes, newFolder];
    setExpandedIds((prev) => ({ ...prev, [currentFolderId]: true }));
    setSelectedNodeId(newFolder.id);
    setModal(null);
    playTone('success', soundEnabled);
    setRoboMood('success');
    setRoboMsg(`Đã tạo thư mục "${trimmed}" trong ${currentFolder.name}!`);
    commitState(nextNodes);
  };

  const handleCreateFile = (e: React.FormEvent) => {
    e.preventDefault();
    let trimmed = inputName.trim();
    const check = validateFileSystemName(trimmed);
    if (!check.valid) {
      setModalError(check.error || 'Tên tệp không hợp lệ.');
      return;
    }
    if (!trimmed.includes('.')) {
      trimmed = `${trimmed}.${newFileKind}`;
    }
    const duplicate = nodes.some(
      (n) =>
        n.parentId === currentFolderId &&
        n.name.toLowerCase() === trimmed.toLowerCase()
    );
    if (duplicate) {
      setModalError(`Đã có tệp tên "${trimmed}" trong thư mục này.`);
      return;
    }

    const ext = trimmed.split('.').pop()?.toLowerCase();
    const fileKind: FileKind =
      ext === 'docx' || ext === 'pptx' || ext === 'png' || ext === 'txt'
        ? ext
        : newFileKind;

    const newFile: FSNode = {
      id: `file-${Date.now()}`,
      name: trimmed,
      type: 'file',
      parentId: currentFolderId,
      fileKind,
      sizeLabel: '12 KB',
      modifiedLabel: 'Vừa xong',
      previewContent: `Tệp mô phỏng "${trimmed}" được tạo trong thư mục ${currentFolder.name}.`,
    };
    const nextNodes = [...nodes, newFile];
    setSelectedNodeId(newFile.id);
    setModal(null);
    playTone('success', soundEnabled);
    setRoboMood('success');
    setRoboMsg(`Đã tạo tệp mô phỏng "${trimmed}" thành công!`);
    commitState(nextNodes);
  };

  const handleRename = (e: React.FormEvent) => {
    e.preventDefault();
    if (modal?.type !== 'rename') return;
    const target = modal.node;
    const trimmed = inputName.trim();
    const check = validateFileSystemName(trimmed);
    if (!check.valid) {
      setModalError(check.error || 'Tên mới không hợp lệ.');
      return;
    }
    const duplicate = nodes.some(
      (n) =>
        n.id !== target.id &&
        n.parentId === target.parentId &&
        n.name.toLowerCase() === trimmed.toLowerCase()
    );
    if (duplicate) {
      setModalError(`Đã tồn tại mục tên "${trimmed}" cùng cấp.`);
      return;
    }

    const nextNodes = nodes.map((n) =>
      n.id === target.id ? { ...n, name: trimmed, modifiedLabel: 'Vừa xong' } : n
    );
    setModal(null);
    playTone('success', soundEnabled);
    setRoboMood('success');
    setRoboMsg(`Đã đổi tên "${target.name}" thành "${trimmed}"!`);
    commitState(nextNodes);
  };

  // Recursive descendant helper (prevents moving a folder into itself)
  const isDescendant = (folderId: string, possibleAncestorId: string): boolean => {
    let cursor = nodes.find((n) => n.id === folderId);
    while (cursor) {
      if (cursor.id === possibleAncestorId) return true;
      cursor = cursor.parentId
        ? nodes.find((n) => n.id === cursor!.parentId)
        : undefined;
    }
    return false;
  };

  const executeCopyToFolder = (sourceNode: FSNode, destFolderId: string) => {
    if (sourceNode.type === 'folder') {
      setRoboMood('encourage');
      setRoboMsg('Hãy chọn tệp để sao chép nhé!');
      return;
    }
    const existing = nodes.some(
      (n) =>
        n.parentId === destFolderId &&
        n.name.toLowerCase() === sourceNode.name.toLowerCase()
    );
    const destFolder = nodes.find((n) => n.id === destFolderId);
    if (existing) {
      playTone('error', soundEnabled);
      setModalError(
        `Thư mục ${destFolder?.name || ''} đã có tệp "${sourceNode.name}".`
      );
      setRoboMood('encourage');
      setRoboMsg(
        `Thư mục ${destFolder?.name || ''} đã có tệp "${sourceNode.name}" rồi!`
      );
      return;
    }

    const copiedFile: FSNode = {
      ...sourceNode,
      id: `file-copy-${Date.now()}`,
      parentId: destFolderId,
      modifiedLabel: 'Vừa sao chép',
    };
    const nextNodes = [...nodes, copiedFile];
    setExpandedIds((prev) => ({ ...prev, [destFolderId]: true }));
    setModal(null);
    playTone('success', soundEnabled);
    setRoboMood('success');
    setRoboMsg(
      `Đã sao chép "${sourceNode.name}" vào thư mục ${destFolder?.name || ''}! Tệp gốc vẫn được giữ nguyên.`
    );
    commitState(nextNodes);
  };

  const executeMoveToFolder = (sourceNode: FSNode, destFolderId: string) => {
    if (sourceNode.id === ROOT_FOLDER_ID) return;
    if (sourceNode.parentId === destFolderId) {
      setModalError('Mục này đang nằm sẵn trong thư mục được chọn.');
      return;
    }
    if (
      sourceNode.type === 'folder' &&
      isDescendant(destFolderId, sourceNode.id)
    ) {
      setModalError('Không thể di chuyển thư mục vào chính thư mục con của nó.');
      return;
    }
    const duplicate = nodes.some(
      (n) =>
        n.parentId === destFolderId &&
        n.name.toLowerCase() === sourceNode.name.toLowerCase()
    );
    const destFolder = nodes.find((n) => n.id === destFolderId);
    if (duplicate) {
      setModalError(
        `Thư mục ${destFolder?.name || ''} đã có mục tên "${sourceNode.name}".`
      );
      return;
    }

    const nextNodes = nodes.map((n) =>
      n.id === sourceNode.id
        ? { ...n, parentId: destFolderId, modifiedLabel: 'Vừa di chuyển' }
        : n
    );
    if (selectedNodeId === sourceNode.id && currentFolderId !== destFolderId) {
      setSelectedNodeId(null);
    }
    setExpandedIds((prev) => ({ ...prev, [destFolderId]: true }));
    setModal(null);
    playTone('success', soundEnabled);
    setRoboMood('success');
    setRoboMsg(
      `Đã di chuyển "${sourceNode.name}" sang thư mục ${destFolder?.name || ''}! Tệp không còn ở vị trí cũ.`
    );
    commitState(nextNodes);
  };

  const handlePasteClipboard = () => {
    if (!clipboard) return;
    const sourceNode = nodes.find((n) => n.id === clipboard.nodeId);
    if (!sourceNode) {
      setClipboard(null);
      return;
    }
    if (clipboard.mode === 'copy') {
      executeCopyToFolder(sourceNode, currentFolderId);
    } else {
      executeMoveToFolder(sourceNode, currentFolderId);
      setClipboard(null);
    }
  };

  const handleConfirmDelete = () => {
    if (modal?.type !== 'delete') return;
    const target = modal.node;
    const idsToDelete = new Set<string>([target.id]);

    // Collect descendants if deleting a folder
    let added = true;
    while (added) {
      added = false;
      for (const n of nodes) {
        if (n.parentId && idsToDelete.has(n.parentId) && !idsToDelete.has(n.id)) {
          idsToDelete.add(n.id);
          added = true;
        }
      }
    }

    const nextNodes = nodes.filter((n) => !idsToDelete.has(n.id));
    if (idsToDelete.has(currentFolderId)) {
      setCurrentFolderId(ROOT_FOLDER_ID);
    }
    if (selectedNodeId && idsToDelete.has(selectedNodeId)) {
      setSelectedNodeId(null);
    }
    setModal(null);
    playTone('click', soundEnabled);
    setRoboMood('guide');
    setRoboMsg(`Đã xóa "${target.name}" khỏi kho dữ liệu mô phỏng.`);
    commitState(nextNodes);
  };

  const handleResetSimulation = () => {
    const freshNodes = INITIAL_FS_NODES.map((n) => ({ ...n }));
    setCurrentFolderId(ROOT_FOLDER_ID);
    setSelectedNodeId(null);
    setSearchQuery('');
    setClipboard(null);
    setExpandedIds({ [ROOT_FOLDER_ID]: true });
    playTone('click', soundEnabled);
    setRoboMood('guide');
    setRoboMsg(
      'Đã khôi phục dữ liệu mô phỏng ban đầu! Em có thể thực hành lại cả 5 nhiệm vụ từ đầu.'
    );
    commitState(freshNodes, false);
  };

  const renderNodeIcon = (node: FSNode, sizeClass = 'w-5 h-5') => {
    if (node.type === 'folder') {
      return <Folder className={`${sizeClass} text-amber-500 fill-amber-100`} />;
    }
    if (node.fileKind === 'png') {
      return <FileImage className={`${sizeClass} text-cyan-600`} />;
    }
    if (node.fileKind === 'pptx') {
      return <Presentation className={`${sizeClass} text-orange-600`} />;
    }
    return <FileText className={`${sizeClass} text-sky-600`} />;
  };

  const renderFolderTree = (folderId: string, depth = 0): React.ReactNode => {
    const folder = nodes.find((n) => n.id === folderId && n.type === 'folder');
    if (!folder) return null;
    const childFolders = nodes
      .filter((n) => n.type === 'folder' && n.parentId === folderId)
      .sort((a, b) => a.name.localeCompare(b.name, 'vi'));
    const isExpanded = expandedIds[folder.id] ?? true;
    const isCurrent = currentFolderId === folder.id && !isSearching;

    return (
      <div key={folder.id}>
        <div
          className={`flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-sm cursor-pointer transition-colors ${
            isCurrent
              ? 'bg-sky-100 text-sky-900 font-semibold'
              : 'text-slate-700 hover:bg-slate-100'
          }`}
          style={{ paddingLeft: `${depth * 14 + 8}px` }}
          onClick={() => {
            setSearchQuery('');
            setCurrentFolderId(folder.id);
            setSelectedNodeId(null);
          }}
        >
          {childFolders.length > 0 ? (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setExpandedIds((prev) => ({
                  ...prev,
                  [folder.id]: !isExpanded,
                }));
              }}
              className="p-0.5 rounded hover:bg-slate-200/70 cursor-pointer"
              aria-label="Mở rộng hoặc thu gọn thư mục"
            >
              {isExpanded ? (
                <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
              ) : (
                <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
              )}
            </button>
          ) : (
            <span className="w-4 inline-block shrink-0" />
          )}
          {isCurrent ? (
            <FolderOpen className="w-4 h-4 text-amber-500 shrink-0" />
          ) : (
            <Folder className="w-4 h-4 text-amber-500 fill-amber-100 shrink-0" />
          )}
          <span className="truncate">{folder.name}</span>
        </div>
        {isExpanded &&
          childFolders.map((cf) => renderFolderTree(cf.id, depth + 1))}
      </div>
    );
  };

  const breadcrumbs = getNodePath(currentFolderId);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6 animate-soft-enter">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold text-cyan-700">
              Bài 3 · SGK Tin học 7 Kết nối tri thức
            </p>
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-slate-900 mt-0.5">
              NHÀ KHO DỮ LIỆU THÔNG MINH
            </h1>
            <p className="text-sm text-slate-600 mt-1">
              Trình quản lí tệp và thư mục mô phỏng an toàn. Mọi thao tác chỉ diễn ra trên kho dữ liệu ảo của bài học.
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <div className="text-right tabular-nums">
              <p className="text-xs text-slate-500">Tiến độ thực hành</p>
              <p className="font-display text-xl font-bold text-cyan-700">
                {progressPercent}% ({missionsDoneCount}/5)
              </p>
            </div>
            <button
              type="button"
              onClick={handleResetSimulation}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-xs sm:text-sm font-semibold text-slate-700 whitespace-nowrap shrink-0 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Đặt lại dữ liệu</span>
            </button>
          </div>
        </div>

        {/* 0-100% Progress bar */}
        <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-sky-500 to-cyan-500 transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      <RoboAssistant
        message={roboMsg}
        mood={roboMood}
        compact
        hintText="Để sao chép tệp: chọn tệp → bấm Sao chép → mở thư mục đích → bấm Dán (hoặc dùng Sao chép đến). Để di chuyển tệp: chọn tệp → bấm Di chuyển → chọn thư mục đích."
      />

      {/* Main Split Workspace: File Manager Simulator (Left 8 cols) + Missions Checklist (Right 4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* FILE MANAGER SIMULATOR */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          {/* Toolbar */}
          <div className="bg-slate-50 border-b border-slate-200 p-3 flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={openNewFolderModal}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold cursor-pointer whitespace-nowrap"
            >
              <FolderPlus className="w-3.5 h-3.5" />
              <span>Thư mục mới</span>
            </button>

            <button
              type="button"
              onClick={openNewFileModal}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-300 hover:bg-slate-100 text-slate-800 text-xs font-semibold cursor-pointer whitespace-nowrap"
            >
              <FilePlus className="w-3.5 h-3.5 text-sky-600" />
              <span>Tệp mới</span>
            </button>

            <span className="h-5 w-px bg-slate-300 mx-0.5 hidden sm:inline-block" />

            <button
              type="button"
              disabled={!selectedNode}
              onClick={() => selectedNode && openRenameModal(selectedNode)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-300 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed text-slate-800 text-xs font-semibold cursor-pointer whitespace-nowrap"
            >
              <Pencil className="w-3.5 h-3.5" />
              <span>Đổi tên</span>
            </button>

            <button
              type="button"
              disabled={!selectedNode || selectedNode.type !== 'file'}
              onClick={() => {
                if (!selectedNode || selectedNode.type !== 'file') return;
                setClipboard({ nodeId: selectedNode.id, mode: 'copy' });
                playTone('click', soundEnabled);
                setRoboMood('guide');
                setRoboMsg(
                  `Đã sao chép "${selectedNode.name}" vào bộ nhớ tạm! Hãy mở thư mục đích rồi bấm nút "Dán" (hoặc dùng "Sao chép đến").`
                );
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-300 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed text-slate-800 text-xs font-semibold cursor-pointer whitespace-nowrap"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>Sao chép</span>
            </button>

            {clipboard && (
              <button
                type="button"
                onClick={handlePasteClipboard}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold cursor-pointer whitespace-nowrap"
              >
                <ClipboardPaste className="w-3.5 h-3.5" />
                <span>Dán vào đây</span>
              </button>
            )}

            <button
              type="button"
              disabled={!selectedNode || selectedNode.type !== 'file'}
              onClick={() => selectedNode && openCopyToModal(selectedNode)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-300 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed text-slate-800 text-xs font-semibold cursor-pointer whitespace-nowrap"
            >
              <Copy className="w-3.5 h-3.5 text-cyan-600" />
              <span>Sao chép đến...</span>
            </button>

            <button
              type="button"
              disabled={!selectedNode || selectedNode.id === ROOT_FOLDER_ID}
              onClick={() => selectedNode && openMoveModal(selectedNode)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-300 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed text-slate-800 text-xs font-semibold cursor-pointer whitespace-nowrap"
            >
              <MoveRight className="w-3.5 h-3.5 text-indigo-600" />
              <span>Di chuyển...</span>
            </button>

            <button
              type="button"
              disabled={!selectedNode || selectedNode.id === ROOT_FOLDER_ID}
              onClick={() => selectedNode && openDeleteModal(selectedNode)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-rose-200 hover:bg-rose-50 disabled:opacity-40 disabled:cursor-not-allowed text-rose-700 text-xs font-semibold cursor-pointer whitespace-nowrap"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Xóa</span>
            </button>
          </div>

          {/* Address Bar + Search Bar */}
          <div className="border-b border-slate-200 p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white">
            <div className="flex items-center gap-2 min-w-0 flex-1">
              <button
                type="button"
                disabled={!currentFolder?.parentId || isSearching}
                onClick={() => {
                  if (currentFolder?.parentId) {
                    setCurrentFolderId(currentFolder.parentId);
                    setSelectedNodeId(null);
                  }
                }}
                className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 disabled:opacity-40 cursor-pointer shrink-0"
                title="Lên thư mục cha"
                aria-label="Lên thư mục cha"
              >
                <ArrowUp className="w-4 h-4 text-slate-600" />
              </button>

              <div className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-700 overflow-x-auto flex-1 min-w-0">
                {isSearching ? (
                  <span className="font-medium text-sky-700 whitespace-nowrap">
                    Kết quả tìm kiếm cho "{searchQuery}"
                  </span>
                ) : (
                  breadcrumbs.map((crumb, idx) => (
                    <React.Fragment key={crumb.id}>
                      {idx > 0 && (
                        <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      )}
                      <button
                        type="button"
                        onClick={() => {
                          setCurrentFolderId(crumb.id);
                          setSelectedNodeId(null);
                        }}
                        className={`hover:text-sky-700 whitespace-nowrap cursor-pointer ${
                          idx === breadcrumbs.length - 1
                            ? 'font-bold text-slate-900'
                            : 'text-slate-600'
                        }`}
                      >
                        {crumb.name}
                      </button>
                    </React.Fragment>
                  ))
                )}
              </div>
            </div>

            <div className="relative w-full sm:w-64 shrink-0">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                placeholder="Tìm kiếm tệp theo tên..."
                aria-label="Tìm kiếm tệp theo tên"
                className="w-full pl-9 pr-8 py-1.5 rounded-lg border border-slate-300 text-xs sm:text-sm focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-0.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                  aria-label="Xóa từ khóa tìm kiếm"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Explorer Split Panes: Left Tree + Right Content */}
          <div className="grid grid-cols-1 md:grid-cols-12 min-h-[380px]">
            {/* Left Folder Tree */}
            <aside className="md:col-span-4 border-b md:border-b-0 md:border-r border-slate-200 bg-slate-50/50 p-3 space-y-1">
              <p className="text-[11px] font-bold text-slate-400 px-2 pb-1">
                CÂY THƯ MỤC
              </p>
              {renderFolderTree(ROOT_FOLDER_ID)}
            </aside>

            {/* Right Folder Content / Search Results */}
            <div className="md:col-span-8 p-4 flex flex-col justify-between">
              <div>
                {isSearching ? (
                  searchResults.length > 0 ? (
                    <div className="space-y-2">
                      {searchResults.map((item) => (
                        <div
                          key={item.id}
                          onClick={() => setSelectedNodeId(item.id)}
                          className={`flex items-center justify-between gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${
                            selectedNodeId === item.id
                              ? 'border-sky-500 bg-sky-50'
                              : 'border-slate-200 hover:bg-slate-50'
                          }`}
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            {renderNodeIcon(item, 'w-6 h-6 shrink-0')}
                            <div className="min-w-0">
                              <p className="font-semibold text-sm text-slate-900 truncate">
                                {item.name}
                              </p>
                              <p className="text-xs text-slate-500 truncate">
                                Vị trí: {getPathString(item.parentId)}
                              </p>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSearchQuery('');
                              if (item.type === 'folder') {
                                setCurrentFolderId(item.id);
                              } else if (item.parentId) {
                                setCurrentFolderId(item.parentId);
                                setSelectedNodeId(item.id);
                              }
                            }}
                            className="px-3 py-1 rounded-lg bg-sky-50 hover:bg-sky-100 text-sky-700 text-xs font-semibold whitespace-nowrap shrink-0 cursor-pointer"
                          >
                            Mở vị trí
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="py-14 text-center text-slate-500 text-sm">
                      Không tìm thấy tệp hoặc thư mục nào khớp với "{searchQuery}".
                    </div>
                  )
                ) : currentItems.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {currentItems.map((item) => {
                      const isSelected = selectedNodeId === item.id;
                      return (
                        <div
                          key={item.id}
                          onClick={() => setSelectedNodeId(item.id)}
                          onDoubleClick={() => {
                            if (item.type === 'folder') {
                              setCurrentFolderId(item.id);
                              setSelectedNodeId(null);
                              setExpandedIds((prev) => ({
                                ...prev,
                                [item.id]: true,
                              }));
                            } else {
                              setModal({ type: 'preview', node: item });
                            }
                          }}
                          className={`group flex items-center justify-between gap-3 p-3.5 rounded-xl border transition-all cursor-pointer select-none ${
                            isSelected
                              ? 'border-sky-500 bg-sky-50 ring-2 ring-sky-100'
                              : 'border-slate-200 bg-white hover:border-sky-300 hover:bg-slate-50/70'
                          }`}
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            {renderNodeIcon(item, 'w-7 h-7 shrink-0')}
                            <div className="min-w-0">
                              <p className="font-semibold text-sm text-slate-900 truncate">
                                {item.name}
                              </p>
                              <p className="text-xs text-slate-500">
                                {item.type === 'folder'
                                  ? 'Thư mục'
                                  : `Tệp · ${item.sizeLabel || '12 KB'}`}
                              </p>
                            </div>
                          </div>

                          {item.type === 'folder' ? (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setCurrentFolderId(item.id);
                                setSelectedNodeId(null);
                                setExpandedIds((prev) => ({
                                  ...prev,
                                  [item.id]: true,
                                }));
                              }}
                              className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-sky-100 text-slate-700 hover:text-sky-800 text-xs font-semibold shrink-0 cursor-pointer"
                            >
                              Mở
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setModal({ type: 'preview', node: item });
                              }}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-sky-700 hover:bg-sky-50 shrink-0 cursor-pointer"
                              title="Xem nội dung tệp"
                              aria-label={`Xem nội dung ${item.name}`}
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="py-14 text-center text-slate-400 text-sm">
                    Thư mục này đang trống. Em có thể tạo thư mục mới, tạo tệp mới hoặc dán tệp vào đây.
                  </div>
                )}
              </div>

              {/* Status Footer inside Explorer */}
              <div className="mt-6 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
                <span>
                  {isSearching
                    ? `${searchResults.length} kết quả phù hợp`
                    : `${currentItems.length} mục trong ${currentFolder.name}`}
                </span>
                <span>
                  {selectedNode
                    ? `Đang chọn: ${selectedNode.name}`
                    : 'Nhấp để chọn mục · Nhấp đúp để mở'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT PANEL: 5 PRACTICAL MISSIONS */}
        <aside className="lg:col-span-4 bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="font-display font-bold text-lg text-slate-900">
              5 Nhiệm vụ thực hành
            </h2>
            <p className="text-xs text-slate-600 mt-0.5">
              Hệ thống tự động kiểm tra trạng thái dữ liệu sau mỗi thao tác của em.
            </p>
          </div>

          <div className="space-y-3">
            {LESSON3_MISSIONS.map((mission) => {
              const done = progress.missions[mission.key];
              return (
                <div
                  key={mission.key}
                  className={`rounded-xl border p-3.5 transition-colors ${
                    done
                      ? 'border-emerald-200 bg-emerald-50/70'
                      : 'border-slate-200 bg-slate-50/50'
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    {done ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                    ) : (
                      <Circle className="w-5 h-5 text-slate-300 shrink-0 mt-0.5" />
                    )}
                    <div className="space-y-1">
                      <p
                        className={`text-sm font-bold ${
                          done ? 'text-emerald-900' : 'text-slate-900'
                        }`}
                      >
                        Nhiệm vụ {mission.number}: {mission.title}
                      </p>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {mission.hint}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {progress.completed && (
            <div className="rounded-xl bg-emerald-600 text-white p-4 space-y-2 text-center">
              <p className="font-display font-bold text-base">
                Hoàn thành 100% Bài 3!
              </p>
              <p className="text-xs text-emerald-50">
                Em đã làm chủ các thao tác quản lí tệp và thư mục.
              </p>
              <button
                type="button"
                onClick={onGoArena}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-white text-emerald-700 font-bold text-xs cursor-pointer hover:bg-emerald-50"
              >
                <span>Vào Đấu trường kiến thức</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </aside>
      </div>

      {/* MODALS FOR FILE SYSTEM OPERATIONS */}
      {modal && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/50 backdrop-blur-xs flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-white rounded-2xl border border-slate-200 max-w-md w-full p-6 shadow-xl space-y-4">
            {/* New Folder */}
            {modal.type === 'new-folder' && (
              <form onSubmit={handleCreateFolder} className="space-y-4">
                <h3 className="font-display font-bold text-lg text-slate-900">
                  Tạo thư mục mới trong {currentFolder.name}
                </h3>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Tên thư mục
                  </label>
                  <input
                    type="text"
                    autoFocus
                    value={inputName}
                    onChange={(e) => {
                      setInputName(e.target.value);
                      setModalError(null);
                    }}
                    placeholder="Ví dụ: DU_AN_TIN_HOC"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                  />
                  {modalError && (
                    <p className="text-xs text-rose-600 font-medium mt-1.5">
                      {modalError}
                    </p>
                  )}
                </div>
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setModal(null)}
                    className="px-4 py-2 rounded-xl border border-slate-300 text-sm font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-sm font-semibold cursor-pointer"
                  >
                    Tạo thư mục
                  </button>
                </div>
              </form>
            )}

            {/* New File */}
            {modal.type === 'new-file' && (
              <form onSubmit={handleCreateFile} className="space-y-4">
                <h3 className="font-display font-bold text-lg text-slate-900">
                  Tạo tệp mô phỏng mới trong {currentFolder.name}
                </h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Tên tệp
                    </label>
                    <input
                      type="text"
                      autoFocus
                      value={inputName}
                      onChange={(e) => {
                        setInputName(e.target.value);
                        setModalError(null);
                      }}
                      placeholder="Ví dụ: ghi_chu.docx"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Loại tệp (nếu chưa ghi đuôi tệp)
                    </label>
                    <select
                      value={newFileKind}
                      onChange={(e) => setNewFileKind(e.target.value as FileKind)}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm bg-white"
                    >
                      <option value="docx">Văn bản (.docx)</option>
                      <option value="pptx">Trình chiếu (.pptx)</option>
                      <option value="png">Hình ảnh (.png)</option>
                      <option value="txt">Văn bản thuần (.txt)</option>
                    </select>
                  </div>
                  {modalError && (
                    <p className="text-xs text-rose-600 font-medium">{modalError}</p>
                  )}
                </div>
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setModal(null)}
                    className="px-4 py-2 rounded-xl border border-slate-300 text-sm font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-sm font-semibold cursor-pointer"
                  >
                    Tạo tệp
                  </button>
                </div>
              </form>
            )}

            {/* Rename */}
            {modal.type === 'rename' && (
              <form onSubmit={handleRename} className="space-y-4">
                <h3 className="font-display font-bold text-lg text-slate-900">
                  Đổi tên "{modal.node.name}"
                </h3>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Tên mới
                  </label>
                  <input
                    type="text"
                    autoFocus
                    value={inputName}
                    onChange={(e) => {
                      setInputName(e.target.value);
                      setModalError(null);
                    }}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                  />
                  {modalError && (
                    <p className="text-xs text-rose-600 font-medium mt-1.5">
                      {modalError}
                    </p>
                  )}
                </div>
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setModal(null)}
                    className="px-4 py-2 rounded-xl border border-slate-300 text-sm font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-sm font-semibold cursor-pointer"
                  >
                    Lưu tên mới
                  </button>
                </div>
              </form>
            )}

            {/* Copy To or Move To Folder Picker */}
            {(modal.type === 'copy-to' || modal.type === 'move') && (
              <div className="space-y-4">
                <h3 className="font-display font-bold text-lg text-slate-900">
                  {modal.type === 'copy-to'
                    ? `Sao chép "${modal.node.name}" vào thư mục`
                    : `Di chuyển "${modal.node.name}" đến thư mục`}
                </h3>
                <div className="max-h-60 overflow-y-auto space-y-1.5 border border-slate-200 rounded-xl p-2 bg-slate-50">
                  {allFolders.map((folder) => (
                    <button
                      key={folder.id}
                      type="button"
                      onClick={() => {
                        setTargetFolderId(folder.id);
                        setModalError(null);
                      }}
                      className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-left cursor-pointer ${
                        targetFolderId === folder.id
                          ? 'bg-sky-600 text-white font-semibold'
                          : 'bg-white text-slate-800 hover:bg-sky-50'
                      }`}
                    >
                      <Folder className="w-4 h-4 shrink-0" />
                      <span className="truncate">{getPathString(folder.id)}</span>
                    </button>
                  ))}
                </div>
                {modalError && (
                  <p className="text-xs text-rose-600 font-medium">{modalError}</p>
                )}
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setModal(null)}
                    className="px-4 py-2 rounded-xl border border-slate-300 text-sm font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
                  >
                    Hủy
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (modal.type === 'copy-to') {
                        executeCopyToFolder(modal.node, targetFolderId);
                      } else {
                        executeMoveToFolder(modal.node, targetFolderId);
                      }
                    }}
                    className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-sm font-semibold cursor-pointer"
                  >
                    {modal.type === 'copy-to' ? 'Xác nhận sao chép' : 'Xác nhận di chuyển'}
                  </button>
                </div>
              </div>
            )}

            {/* Delete Confirm */}
            {modal.type === 'delete' && (
              <div className="space-y-4">
                <h3 className="font-display font-bold text-lg text-slate-900">
                  Xác nhận xóa
                </h3>
                <p className="text-sm text-slate-600">
                  Em có chắc chắn muốn xóa{' '}
                  <strong className="text-slate-900">"{modal.node.name}"</strong>
                  {modal.node.type === 'folder'
                    ? ' và toàn bộ nội dung bên trong'
                    : ''}{' '}
                  không?
                </p>
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setModal(null)}
                    className="px-4 py-2 rounded-xl border border-slate-300 text-sm font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
                  >
                    Hủy
                  </button>
                  <button
                    type="button"
                    onClick={handleConfirmDelete}
                    className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-sm font-semibold cursor-pointer"
                  >
                    Xóa
                  </button>
                </div>
              </div>
            )}

            {/* Preview File Content */}
            {modal.type === 'preview' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2.5">
                    {renderNodeIcon(modal.node, 'w-6 h-6')}
                    <h3 className="font-display font-bold text-lg text-slate-900">
                      {modal.node.name}
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => setModal(null)}
                    className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="rounded-xl bg-slate-50 border border-slate-200 p-4 text-sm text-slate-700 leading-relaxed">
                  {modal.node.previewContent || 'Tệp mô phỏng học tập Tin học 7.'}
                </div>
                <div className="flex justify-between items-center text-xs text-slate-500">
                  <span>Kích thước: {modal.node.sizeLabel || '12 KB'}</span>
                  <button
                    type="button"
                    onClick={() => setModal(null)}
                    className="px-4 py-2 rounded-xl bg-sky-600 text-white font-semibold cursor-pointer"
                  >
                    Đóng
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
