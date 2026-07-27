"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getJob } from "@/lib/mock-data";
import { getSession } from "@/lib/auth";
import { getPhotos, addPhoto, deletePhoto, getWorkflowState } from "@/lib/store";
import WorkflowHeader from "@/components/tech/WorkflowHeader";
import WorkflowNav from "@/components/tech/WorkflowNav";
import type { JobPhoto, PhotoCategory, JobWorkflowState } from "@/types";
import { Camera, Upload, Trash2, Plus, Image, CheckCircle } from "lucide-react";
import { clsx } from "clsx";

const CATEGORIES: { value: PhotoCategory; label: string; desc: string; color: string }[] = [
  { value: "before", label: "Before", desc: "Condition before work", color: "bg-blue-50 text-blue-700 border-blue-200" },
  { value: "defect", label: "Defect", desc: "Failed component / damage", color: "bg-red-50 text-red-700 border-red-200" },
  { value: "meter_reading", label: "Meter Reading", desc: "Screenshot of meter display", color: "bg-yellow-50 text-yellow-700 border-yellow-200" },
  { value: "parts", label: "Parts", desc: "Old vs new parts", color: "bg-purple-50 text-purple-700 border-purple-200" },
  { value: "serial_number", label: "Serial #", desc: "Serial number plate", color: "bg-gray-50 text-gray-700 border-gray-200" },
  { value: "after", label: "After", desc: "Completed work", color: "bg-green-50 text-green-700 border-green-200" },
  { value: "other", label: "Other", desc: "Miscellaneous", color: "bg-gray-50 text-gray-500 border-gray-200" },
];

// Mock photo thumbnails — colored placeholder blocks by category
const MOCK_COLORS: Record<PhotoCategory, string> = {
  before: "bg-blue-200", defect: "bg-red-200", meter_reading: "bg-yellow-200",
  parts: "bg-purple-200", serial_number: "bg-gray-200", after: "bg-green-200", other: "bg-gray-100",
};

function uid() { return `ph_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`; }

function PhotoTile({ photo, onDelete }: { photo: JobPhoto; onDelete: () => void }) {
  const cat = CATEGORIES.find(c => c.value === photo.category);
  return (
    <div className="relative group">
      <div className={clsx("aspect-square rounded-xl flex flex-col items-center justify-center", MOCK_COLORS[photo.category])}>
        <Image className="w-8 h-8 text-white/60 mb-1" />
        <span className="text-white text-[10px] font-semibold px-2 text-center">{photo.filename}</span>
      </div>
      <div className="absolute top-1.5 left-1.5">
        <span className={clsx("jdr-badge text-[10px] border", cat?.color)}>{cat?.label}</span>
      </div>
      <button
        onClick={onDelete}
        className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <Trash2 className="w-3 h-3" />
      </button>
      {photo.caption && (
        <p className="text-jdr-slate text-[10px] mt-1 truncate px-0.5">{photo.caption}</p>
      )}
    </div>
  );
}

export default function PhotosPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const router = useRouter();
  const [workflow, setWorkflow] = useState<JobWorkflowState | null>(null);
  // photosAdded tracks whether any photos have been attached
  const [photos, setPhotos] = useState<JobPhoto[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [category, setCategory] = useState<PhotoCategory>("before");
  const [caption, setCaption] = useState("");
  const [filename, setFilename] = useState("");
  const [saved, setSaved] = useState(false);

  const job = getJob(id);

  useEffect(() => {
    const session = getSession();
    if (!session) { router.replace("/login"); return; }
    setPhotos(getPhotos(id));
    setWorkflow(getWorkflowState(id));
  }, [id, router]);

  function handleAdd() {
    const name = filename.trim() || `${category}_${new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }).replace(":", "")}.jpg`;
    const photo: JobPhoto = {
      id: uid(), jobId: id, filename: name, caption: caption.trim(),
      category, timestamp: new Date().toISOString(), size: `${(Math.random() * 2 + 0.5).toFixed(1)} MB`,
    };
    addPhoto(id, photo);
    setPhotos(getPhotos(id));
    setWorkflow(getWorkflowState(id));
    setCaption("");
    setFilename("");
    setShowForm(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  function handleDelete(photoId: string) {
    deletePhoto(id, photoId);
    setPhotos(getPhotos(id));
  }

  // Group by category
  const grouped = CATEGORIES.map(cat => ({
    ...cat,
    items: photos.filter(p => p.category === cat.value),
  })).filter(g => g.items.length > 0);

  if (!job) return null;

  return (
    <div className="pb-8">
      <WorkflowHeader job={job} title="Photos & Attachments" backHref={`/tech/jobs/${id}`} />

      <div className="px-4 py-4 space-y-5">
        {workflow && <WorkflowNav jobId={id} state={workflow} compact />}

        {/* Photo guidelines */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <p className="text-blue-800 font-semibold text-sm mb-2">Photo Documentation Guidelines</p>
          <div className="space-y-1">
            {[
              "Take a 'Before' photo of the appliance before any work begins",
              "Photograph all visible defects or damaged components",
              "Capture meter/display readings with the measurement visible",
              "Document serial number plates on all accessed components",
              "Take 'After' photos once work is complete",
            ].map((g, i) => (
              <div key={i} className="flex gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-blue-500 flex-shrink-0 mt-0.5" />
                <p className="text-blue-700 text-xs">{g}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Count by category */}
        {photos.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-semibold uppercase tracking-widest text-jdr-slate">Photos ({photos.length})</p>
              {saved && (
                <span className="flex items-center gap-1 text-green-600 text-xs font-medium">
                  <CheckCircle className="w-3.5 h-3.5" />Photo added
                </span>
              )}
            </div>

            {grouped.map(group => (
              <div key={group.value} className="mb-5">
                <div className="flex items-center gap-2 mb-2">
                  <span className={clsx("jdr-badge border", group.color)}>{group.label}</span>
                  <span className="text-jdr-slate text-xs">{group.items.length} photo{group.items.length !== 1 ? "s" : ""}</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {group.items.map(photo => (
                    <PhotoTile key={photo.id} photo={photo} onDelete={() => handleDelete(photo.id)} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Add photo form */}
        {showForm ? (
          <div className="jdr-card p-4 space-y-4">
            <p className="font-bold text-jdr-navy">Add Photo</p>

            {/* Category selection */}
            <div>
              <label className="jdr-label">Category</label>
              <div className="grid grid-cols-2 gap-2">
                {CATEGORIES.map(cat => (
                  <button key={cat.value} onClick={() => setCategory(cat.value)}
                    className={clsx("flex items-start gap-2 p-3 rounded-xl border text-left transition-all",
                      category === cat.value ? "border-jdr-navy bg-jdr-cream ring-1 ring-jdr-navy/20" : "border-gray-200 bg-white hover:border-gray-300"
                    )}>
                    <div className={clsx("w-2.5 h-2.5 rounded-full mt-1 flex-shrink-0", MOCK_COLORS[cat.value].replace("bg-", "bg-").replace("-200", "-400"))} />
                    <div>
                      <p className={clsx("font-semibold text-sm", category === cat.value ? "text-jdr-navy" : "text-jdr-slate")}>{cat.label}</p>
                      <p className="text-gray-400 text-[10px]">{cat.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* File name (simulated) */}
            <div>
              <label className="jdr-label">Filename (optional)</label>
              <input value={filename} onChange={e => setFilename(e.target.value)}
                placeholder={`${category}_${new Date().toLocaleTimeString().replace(/:/g, "")}.jpg`}
                className="jdr-input text-sm" />
            </div>

            <div>
              <label className="jdr-label">Caption</label>
              <input value={caption} onChange={e => setCaption(e.target.value)}
                placeholder="Describe what this photo shows…"
                className="jdr-input text-sm" />
            </div>

            {/* Mock camera / file upload */}
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center">
              <Camera className="w-10 h-10 text-gray-300 mx-auto mb-2" />
              <p className="text-jdr-slate text-sm font-medium">Camera / File Upload</p>
              <p className="text-gray-400 text-xs mt-1">Photo capture interface — available on device</p>
            </div>

            <div className="flex gap-3">
              <button onClick={() => { setShowForm(false); setCaption(""); setFilename(""); }}
                className="flex-1 py-3 border border-gray-200 rounded-xl text-jdr-slate text-sm font-medium hover:bg-jdr-cream transition-colors">
                Cancel
              </button>
              <button onClick={handleAdd}
                className="flex-1 jdr-btn-gold">
                Add to Job
              </button>
            </div>
          </div>
        ) : (
          <button onClick={() => setShowForm(true)}
            className="w-full flex items-center justify-center gap-2 py-4 border-2 border-dashed border-gray-300 rounded-xl text-jdr-slate hover:border-jdr-gold hover:text-jdr-navy transition-colors font-medium">
            <Camera className="w-5 h-5" />Add Photo / Attachment
          </button>
        )}
      </div>
    </div>
  );
}
