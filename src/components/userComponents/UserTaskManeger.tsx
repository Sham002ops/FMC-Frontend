import { BackendUrl } from "@/Config";
import axios from "axios";
import { CheckCircle2, Sparkles, Copy, Check } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

interface UserTasksModalProps {
  setOpenTasksModal: React.Dispatch<React.SetStateAction<boolean>>;
  refreshUserStats?: () => void;
}

interface Task {
  id: string;
  title: string;
  description?: string;
  type: "NORMAL" | "YOGA";
  isActive: boolean;
  completed: boolean;
  completedAt: string | null;
}

interface TasksResponse {
  package: {
    id: string;
    name: string;
  };
  tasks: Task[];
}

const UserTasksModal: React.FC<UserTasksModalProps> = ({
  setOpenTasksModal,
  refreshUserStats,
}) => {
  const [loading, setLoading] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [packageName, setPackageName] = useState<string>("");
  const [error, setError] = useState("");
  const [copiedTaskId, setCopiedTaskId] = useState<string | null>(null);

  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const cardRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    fetchTasks();
  }, []);

  useEffect(() => {
    if (wrapperRef.current && cardRef.current) {
      gsap.set(wrapperRef.current, { opacity: 0 });
      gsap.set(cardRef.current, { opacity: 0, y: 40, scale: 0.95 });

      const tl = gsap.timeline();
      tl.to(wrapperRef.current, {
        opacity: 1,
        duration: 0.2,
        ease: "power2.out",
      }).to(
        cardRef.current,
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.35,
          ease: "back.out(1.5)",
        },
        "-=0.05"
      );
    }
  }, []);

  const closeWithAnimation = () => {
    if (!wrapperRef.current || !cardRef.current) {
      setOpenTasksModal(false);
      return;
    }

    const tl = gsap.timeline({
      onComplete: () => setOpenTasksModal(false),
    });

    tl.to(cardRef.current, {
      opacity: 0,
      y: 20,
      scale: 0.97,
      duration: 0.25,
      ease: "power2.in",
    }).to(
      wrapperRef.current,
      {
        opacity: 0,
        duration: 0.2,
        ease: "power2.in",
      },
      "-=0.1"
    );
  };

  const fetchTasks = async () => {
    try {
      setLoading(true);
      setError("");
      const token = localStorage.getItem("token");
      if (!token) {
        setError("User token missing. Please login again.");
        setLoading(false);
        return;
      }

      const res = await axios.get<TasksResponse>(
        `${BackendUrl}/tasks/user/my-package-tasks`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setPackageName(res.data.package?.name || "");
      setTasks(res.data.tasks || []);
    } catch (err: any) {
      setError(
        err?.response?.data?.error || "Failed to fetch your tasks. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const total = tasks.length;
  const completed = tasks.filter((t) => t.completed).length;
  const remaining = total - completed;

  const handleCompleteTask = async (task: Task) => {
    if (task.completed) return;

    const token = localStorage.getItem("token");
    if (!token) return;

    setTasks((prev) =>
      prev.map((t) =>
        t.id === task.id
          ? { ...t, completed: true, completedAt: new Date().toISOString() }
          : t
      )
    );
    microAnimateCheckbox(task.id);

    try {
      await axios.post(
        `${BackendUrl}/tasks/user/tasks/complete`,
        { taskId: task.id },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (refreshUserStats) refreshUserStats();
    } catch (err) {
      setTasks((prev) =>
        prev.map((t) =>
          t.id === task.id ? { ...t, completed: false, completedAt: null } : t
        )
      );
    }
  };

  // Copy title + micro animation
  const handleCopyTitle = async (task: Task) => {
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(task.title);
      } else {
        // fallback
        const textarea = document.createElement("textarea");
        textarea.value = task.title;
        textarea.style.position = "fixed";
        textarea.style.left = "-9999px";
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
      }

      setCopiedTaskId(task.id);
      microAnimateCopy(task.id);

      setTimeout(() => {
        setCopiedTaskId((prev) => (prev === task.id ? null : prev));
      }, 1200);
    } catch (e) {
      console.error("Failed to copy text");
    }
  };

  // Copy description (fallback to title) + micro animation
const handleCopyDescription = async (task: Task) => {
  const textToCopy = task.description?.trim() || task.title;

  try {
    if (navigator?.clipboard?.writeText) {
      await navigator.clipboard.writeText(textToCopy);
    } else {
      const textarea = document.createElement("textarea");
      textarea.value = textToCopy;
      textarea.style.position = "fixed";
      textarea.style.left = "-9999px";
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
    }

    setCopiedTaskId(task.id);
    microAnimateCopy(task.id);

    setTimeout(() => {
      setCopiedTaskId((prev) => (prev === task.id ? null : prev));
    }, 1200);
  } catch (e) {
    console.error("Failed to copy text");
  }
};

  const linkifyDescription = (text: string) => {
  if (!text) return "";

  // simple URL regex; you can refine for your use case
  const urlRegex = /(https?:\/\/[^\s]+)/g;

  return text.replace(urlRegex, (url) => {
    // ensure protocol exists
    const withProtocol = url.startsWith("http") ? url : `https://${url}`;
    return `<a href="${withProtocol}" target="_blank" rel="noopener noreferrer" class="text-indigo-600 underline">${url}</a>`;
  });
};



  const microAnimateCheckbox = (id: string) => {
    const el = document.querySelector<HTMLElement>(`[data-checkbox-id="${id}"]`);
    if (!el) return;

    const tl = gsap.timeline();
    tl.to(el, { scale: 0.9, duration: 0.06, ease: "power2.out" })
      .to(el, { scale: 1.12, duration: 0.12, ease: "back.out(2.2)" })
      .to(el, { scale: 1, duration: 0.1, ease: "power2.out" });

    const burst = el.querySelector(".checkbox-burst");
    if (burst) {
      gsap.fromTo(
        burst,
        { opacity: 0, scale: 0.4 },
        { opacity: 1, scale: 1.5, duration: 0.22, ease: "power2.out" }
      );
      gsap.to(burst, {
        opacity: 0,
        scale: 1.9,
        duration: 0.22,
        ease: "power2.in",
        delay: 0.05,
      });
    }
  };

  const microAnimateCopy = (id: string) => {
    const el = document.querySelector<HTMLElement>(`[data-copy-id="${id}"]`);
    if (!el) return;

    gsap.fromTo(
      el,
      { scale: 0.9, rotate: 0 },
      {
        scale: 1.2,
        rotate: -8,
        duration: 0.15,
        ease: "back.out(2)",
        yoyo: true,
        repeat: 1,
      }
    );
  };

  return (
    <div
      ref={wrapperRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 p-2"
      onClick={closeWithAnimation}
    >
      <div
        ref={cardRef}
        className="relative w-full max-w-md md:max-w-xl xl:max-w-2xl overflow-hidden bg-slate-50 rounded-2xl pb-10 shadow-2xl flex flex-col items-center justify-start"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Gradient decorations */}
        <div className="hidden sm:block absolute top-0 -left-12 w-40 h-20 bg-gradient-to-tr from-indigo-500 to-purple-600 rounded-full opacity-70" />
        <div className="hidden sm:block absolute bottom-0 -right-14 w-44 h-24 bg-gradient-to-tr from-pink-500 to-rose-500 rounded-full opacity-80" />

        {/* Close button */}
        <button
          className="absolute top-4 right-5 text-3xl text-slate-700 hover:text-red-500 font-bold z-10"
          aria-label="Close modal"
          onClick={closeWithAnimation}
        >
          ×
        </button>

        {/* Header */}
        <div className="mt-10 mb-3 text-2xl text-center relative z-10">
          <div className="bg-clip-text text-transparent font-bold bg-gradient-to-tr from-indigo-900 via-purple-700 to-pink-500 text-xl md:text-3xl">
            Your Daily Tasks
          </div>
          <p className="text-sm md:text-sm text-slate-600 mt-1">
            Package:{" "}
            <span className="font-semibold">
              {packageName || "No active package"}
            </span>
          </p>
        </div>

        {/* Stats Row */}
        <div className="relative z-10 w-full px-4 md:px-6 mb-4">
          <div className="grid grid-cols-3 gap-2 text-center text-md md:text-lg">
            <div className="bg-white rounded-xl shadow-sm py-2">
              <p className="text-[10px] text-slate-500 uppercase tracking-wide">
                Total
              </p>
              <p className="text-lg font-bold text-slate-800">{total}</p>
            </div>
            <div className="bg-white rounded-xl shadow-sm py-2">
              <p className="text-[10px] text-emerald-600 uppercase tracking-wide">
                Done
              </p>
              <p className="text-lg font-bold text-emerald-600">{completed}</p>
            </div>
            <div className="bg-white rounded-xl shadow-sm py-2">
              <p className="text-[10px] text-amber-600 uppercase tracking-wide">
                Left
              </p>
              <p className="text-lg font-bold text-amber-600">{remaining}</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="relative z-10 w-full px-4 md:px-6 pb-6 max-h-[60vh] overflow-y-auto">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-10">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-3" />
              <p className="text-slate-600 text-sm">Loading your tasks…</p>
            </div>
          ) : error ? (
            <p className="text-red-600 text-center text-sm py-8">{error}</p>
          ) : tasks.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-slate-500 text-lg">
              <CheckCircle2 className="w-10 h-10 text-slate-300 mb-2" />
              No tasks assigned yet for your current package.
            </div>
          ) : (
            <div className="space-y-3">
              {tasks.map((task) => (
                <button
                  key={task.id}
                  className={`w-full flex items-start gap-3 rounded-xl border px-3 py-2.5 text-left transition-all ${
                    task.completed
                      ? "bg-emerald-50/80 border-emerald-200"
                      : "bg-white border-slate-200 hover:bg-slate-50"
                  }`}
                  onClick={() => handleCompleteTask(task)}
                >
                  {/* Checkbox */}
                  <div
                    data-checkbox-id={task.id}
                    className={`relative mt-0.5 flex h-7 w-7 items-center justify-center rounded-full border-2 transition-colors ${
                      task.completed
                        ? "border-emerald-500 bg-emerald-500"
                        : "border-slate-300 bg-white"
                    }`}
                  >
                    <div className="absolute inset-0 rounded-full checkbox-burst pointer-events-none" />
                    {task.completed ? (
                      <CheckCircle2 className="w-4 h-4 text-white" />
                    ) : (
                      <span className="w-2.5 h-2.5 rounded-full bg-slate-300" />
                    )}
                  </div>

                  {/* Text + copy icon */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p
                        className={`text-xl font-semibold ${
                          task.completed
                            ? "text-slate-500 line-through"
                            : "text-slate-800"
                        }`}
                      >
                        {task.title}
                      </p>

                      {task.type === "YOGA" && (
                        <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-pink-50 text-pink-600 border border-pink-100">
                          <Sparkles className="w-3 h-3" />
                          Yoga
                        </span>
                      )}
                    </div>

                    {task.description && (
                      <div className=" flex first-letter:justify-center items-center">
                       <p
                          className="text-lg text-slate-500 mt-0.5"
                          // description may contain links
                          dangerouslySetInnerHTML={{ __html: linkifyDescription(task.description) }}
                        />
                      <div>
                        <button
                            type="button"
                            data-copy-id={task.id}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCopyDescription(task);
                            }}
                            className="ml-1 inline-flex items-center justify-center rounded-full p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                            aria-label="Copy task description"
                          >
                            {copiedTaskId === task.id ? (
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>

                      </div>
                      </div>
                    )}
                    {task.completed && task.completedAt && (
                      <p className="text-[16px] text-emerald-600 mt-0.5">
                        Completed at{" "}
                        {new Date(task.completedAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserTasksModal;
